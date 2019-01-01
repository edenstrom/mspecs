import { getDirectory } from './utils/getDirectory';

export const generateIndex = async () => {
  const files = await getDirectory('./src/models');

  return files
    .map(fileName => `export * from './models/${fileName.replace('.ts', '')}';`)
    .join('\n');
};
