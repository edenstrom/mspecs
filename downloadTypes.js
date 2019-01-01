// @ts-check
const got = require('got');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function run() {
  const raw = await readFile('./schemas.json', 'utf-8');
  const schemas = JSON.parse(raw);

  await Promise.all(
    schemas.map(async schema => {
      const data = await got.get(`https://api.mspecs.se/schema/${schema}`);

      await writeFile(`./types/${schema}.json`, data.body, 'utf-8');

      console.log('Downloaded', data.body.length);
    })
  );
}

run();
