import fs from 'fs';
import { promisify } from 'util';
import { createMspecsTable } from '../types/MspecsTable';

const readFile = promisify(fs.readFile);

export const readClass = async (fileName: string) => {
  const file = await readFile(`./types/${fileName}`, 'utf-8');

  const json = JSON.parse(file);

  if (!json) {
    console.error('Failed generating for class', fileName);
    return null;
  }

  const data = createMspecsTable(json);

  return data;
};
