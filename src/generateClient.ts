import { promises as fs } from 'fs';
import { getAllFromTable } from './jsonTable';

export const generateClient = async (fileNames: string[]) => {
  const classes = getAllFromTable();

  const imports = classes.map(
    c => `import { ${c.className} } from './${c.className}';`
  );

  const methods = classes.map(c => {
    return `  ${c.name} = {
    all: ${c.className}.getAll(this),
    first: ${c.className}.getFirst(this),
    byId: ${c.className}.getById(this),
    byIds: ${c.className}.getByIds(this),
    create: ${c.className}.create(this),
  };`;
  });

  const output = `import { MspecsBaseClient } from '../MspecsBaseClient';
${imports.join('\n')}

export class MspecsClient extends MspecsBaseClient {
${methods.join('\n\n')}
}
  `;

  fs.writeFile('./src/models/MspecsClient.ts', output, 'utf-8');
};
