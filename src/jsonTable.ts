import { MspecsTable } from './types/MspecsTable';
import { firstCharacterLowercase } from './utils/capitalize';
import { isNotNull } from './utils/isNotNull';
import { readClass } from './utils/readClass';

const jsonTable = new Map<string, MspecsTable>();

export const initTable = async (fileNames: string[]) => {
  const classes = (await Promise.all(fileNames.map(readClass))).filter(
    isNotNull
  );

  classes.map(c => {
    jsonTable.set(c.name, c);
  });
};

export const getFromTable = (name: string) => {
  return jsonTable.get(name);
};

export const getAllFromTable = () => {
  return [...jsonTable.values()];
};

export const getFromTableViaClassName = (className: string) => {
  const name = firstCharacterLowercase(className.replace('Mspecs', ''));

  return getFromTable(name);
};
