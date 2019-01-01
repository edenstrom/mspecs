import fs from 'fs';
import { promisify } from 'util';
import { generateClass } from './generateClass';
import { generateClient } from './generateClient';
import { generateIndex } from './generateIndexFile';
import { initTable } from './jsonTable';
import { getDirectory } from './utils/getDirectory';

console.clear();

const writeFile = promisify(fs.writeFile);

(async () => {
  const files = await getDirectory('./types');
  await initTable(files);

  // generateClass(files[82]);

  for (let file of files) {
    generateClass(file);
  }

  generateClient(files);

  const index = await generateIndex();

  await writeFile('./src/index.ts', index, 'utf-8');
})();

setInterval(() => {}, 1 << 30);
