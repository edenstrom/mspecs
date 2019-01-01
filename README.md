# Mspecs API Wrapper for Node.js

Fully-typed, generated api wrapper for mspecs based on the official documentation.

## Motivation

TODO

## Usage

`npm install --save mspecs`

```ts
import { MspecsClient } from 'mspecs';

const client = new MspecsClient({
  host: 'https://api.mspecs.se', // tested with demo.mspecs.se and api.mspecs.se
  auth: {
    username: 'YOUR_USERNAME',
    password: 'YOUR_PASSWORD'
  }
});

const deals = await client.deals.all({
  collections: ['sellers'],
  limit: 5
});
```

## Generating types

TODO

## Todo

1. Tests
2. Refactor and structure generation
3. Add support for different mspecs versions (demo & api)
4. Add support for more languages, f.e. C♯.
5. Add more examples
