export const types = {
  primaryKey: 'string',
  text: 'string',
  bit: 'boolean',
  datetime: 'Date',
  money: 'number',
  percentage: 'number',
  decimal: 'number',
  int: 'number',
  date: 'Date',
  updated: 'Date',
  year: 'number',
  keyField: 'string',
  timestamp: 'number',
  'int unsigned': 'number',
  area: 'number',
  jsonObject: 'string',
  password: 'string',
  currency: 'string',
  tinyint: 'number',
  smallint: 'number',
  language: 'string',
  float: 'number',
  genericForeignKey: 'string',
};

export type Types = keyof typeof types;

export const convertMspecsTypeToTypeScript = (type: string): string => {
  return (types as any)[type] || '';
};
