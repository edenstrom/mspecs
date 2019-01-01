import { getFromTable } from '../jsonTable';
import { MspecsTableField } from '../types/MspecsTable';
import { capitalize } from './capitalize';

export const getForeignClassMethod = (
  field: MspecsTableField,
  foreignClass?: string
) => {
  if (!foreignClass) return '';
  const table = getFromTable(foreignClass);
  if (!table) return '';

  const fieldName = capitalize(field.name.replace('Id', ''));

  return `  get${fieldName}(query?: MspecsApiOptions<${
    table.collectionName
  }>): Promise<${table.className} | null> {
    return this.client.${table.name}.byId(this.${field.name}, query);
  }`;
};
