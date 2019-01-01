import * as fs from 'fs';
import { promisify } from 'util';

const readDir = promisify(fs.readdir);

export const getDirectory = async (dir: string) => {
  const fileNames = await readDir(dir);

  return fileNames;
};
