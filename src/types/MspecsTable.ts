import pluralize from 'pluralize';
import { brokenCollections } from '../brokenCollections';
import { getClassName } from '../utils/getClassName';

export interface MspecsTableField {
  name: string;
  type: 'foreignKey' | 'enum';
  table?: string;
  note?: string;
  enums?: string[];
  schema?: string;
  maxLength?: number;
  default?: number;
  mandatory?: boolean;
  isDeprecated?: true;
}

export interface MspecsTable {
  name: string;
  singularName: string;
  className: string;
  interfaceName: string;
  collectionName: string;

  publicFields: MspecsTableField[];
  collections: string[];
}

export const createMspecsTable = (json: Partial<MspecsTable>): MspecsTable => {
  const name = json.name || '';
  const className = getClassName(name);
  const collections = (json.collections || []).filter(
    item => !brokenCollections.includes(item)
  );
  return {
    name,
    singularName: pluralize.singular(name),
    className,
    interfaceName: `I${className}`,
    collectionName: `${className}CollectionTypes`,
    publicFields: json.publicFields || [],
    collections
  };
};
