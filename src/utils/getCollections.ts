import { getFromTable } from '../jsonTable';
import { MspecsTable } from '../types/MspecsTable';
import { isNotNull } from '../utils/isNotNull';
import { capitalize } from './capitalize';

export const getCollections = (current: MspecsTable, collections: string[]) => {
  const tables = collections.map(item => getFromTable(item)).filter(isNotNull);
  const type = `{
${tables.map(t => `    ${t.name}: ${t.className}[],`).join('\n')}
  }`;

  const value = `collections: ${type} = {
${tables.map(t => `   ${t.name}: [],`).join('\n')}
  };`;

  const methods = tables
    .map(collection => {
      return `  get${capitalize(collection.name)}(): Promise<${
        collection.className
      }[]> {
    return this.client.${collection.name}.all({ q: \`${
        current.singularName
      }Id='\${this.id}'\` })
  }
    
  create${capitalize(collection.singularName)}(${collection.singularName}: ${
        collection.interfaceName
      }): Promise<${collection.className}> {
    const body = new ${collection.className}({
      ${current.singularName}Id: this.id,
      ...${collection.singularName},
    }, this.client);

    return this.client.${collection.name}.create(body);
  }`;
    })
    .join('\n\n');

  return {
    type,
    value,
    methods
  };
};
