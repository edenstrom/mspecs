import * as fs from 'fs';
import { promisify } from 'util';
import { getFromTable } from './jsonTable';
import { convertMspecsTypeToTypeScript } from './types';
import { getClassName } from './utils/getClassName';
import { getCollections } from './utils/getCollections';
import { getForeignClassMethod } from './utils/getForeignClassMethod';
import { isNotNull } from './utils/isNotNull';
import { readClass } from './utils/readClass';

const writeFile = promisify(fs.writeFile);

export const generateClass = async (fileName: string) => {
  const data = await readClass(fileName);

  if (!data) return null;

  let imports = new Set<string>();
  let enums = new Set<string>();
  let methods: string[] = [];

  const collectionTable = data.collections
    .map(item => getFromTable(item))
    .filter(isNotNull);

  collectionTable.map(collection => {
    if (collection.className !== data.className) {
      imports.add(collection.className);
    }
  });

  const fields = data.publicFields
    .map(field => {
      let str = '';
      const type = convertMspecsTypeToTypeScript(field.type);

      if (field.type === 'foreignKey') {
        const foreignClass = getClassName(field.table);

        if (foreignClass !== data.className) {
          imports.add(foreignClass);
        }

        str = `  ${field.name}?: string;`;

        methods.push(getForeignClassMethod(field, field.table));
      } else if (field.type === 'enum') {
        const enumName = data.className + getClassName(field.name, false);

        const fieldEnums = field.enums || [];

        const enumFields = fieldEnums.map(e => `'${e}' = '${e}'`);

        enums.add(`export enum ${enumName} {
  ${enumFields.join(',\n  ')}
}
`);

        str = `  ${field.name}?: ${enumName};`;
      } else if (type) {
        str = `  ${field.name}?: ${type};`;
      }

      if (str.length === 0) {
        return null;
      }

      if (field.note || field.isDeprecated) {
        str = `
  /**
   *${field.isDeprecated ? ' @deprecated' : ''}${
          field.note ? ` ${field.note}` : ''
        }
   */
${str}`;
      }

      return str;
    })
    .filter(field => field !== null);

  const allImports = [...imports.values()]
    .map(c => `import { ${c}, I${c}, ${c}CollectionTypes } from './${c}';`)
    .join('\n');

  const allEnums = [...enums.values()].join('\n');

  const collections = getCollections(data, data.collections);

  const collectionTypes = `export type ${
    data.collectionName
  } = "${data.collections.join('" | "')}"`;

  const output = `import { MspecsClient } from './MspecsClient';
import { MspecsApiOptions } from '../MspecsBaseClient';
${allImports}

${allEnums}

${collectionTypes}

export interface ${data.interfaceName} {
  collections?: ${collections.type};
${fields.join('\n')}
  [key: string]: any;
}

export class ${data.className} {
  constructor(obj: ${
    data.interfaceName
  } | null | undefined, private client: MspecsClient) {
    if (obj == null) {
      return;
    }

    Object.keys(obj).forEach(key => {
      if (key === 'collections') return;
      this[key] = obj[key];
    })

    const collections = obj.collections || {};

    this.collections = {
      ...this.collections,
      ...collections
    };
  }

  ${collections.value}
  
${fields.join('\n')}
  [key: string]: any;

${methods.join('\n')}
${collections.methods}
  static getById = (client: MspecsClient) => async (id: string | null | undefined, query?: MspecsApiOptions<${
    data.collectionName
  }>): Promise<${data.className} | null> => {
    return client.getById<${data.className}, ${data.collectionName}>(${
    data.className
  }, '${data.name}', id, query);
  }

  static getByIds = (client: MspecsClient) => async (ids: string[] | null[] | undefined[], query?: MspecsApiOptions<${
    data.collectionName
  }>): Promise<${data.className}[]> => {
    return client.getByIds<${data.className}, ${data.collectionName}>(${
    data.className
  }, '${data.name}', ids, query);
  }

  static getAll = (client: MspecsClient) => async (query?: MspecsApiOptions<${
    data.collectionName
  }>): Promise<${data.className}[]> => {
    return client.getAll<${data.className}, ${data.collectionName}>(${
    data.className
  }, '${data.name}', query);
  }

  static getFirst = (client: MspecsClient) => async (query?: MspecsApiOptions<${
    data.collectionName
  }>): Promise<${data.className}> => {
    return client.getFirst<${data.className}, ${data.collectionName}>(${
    data.className
  }, '${data.name}', query);
  }

  static create = (client: MspecsClient) => async (input: ${
    data.interfaceName
  }): Promise<${data.className}> => {
    return client.create<${data.className}>(${data.className}, '${
    data.name
  }', input);
  }
}`;

  await writeFile(`./src/models/${data.className}.ts`, output, 'utf-8');
};
