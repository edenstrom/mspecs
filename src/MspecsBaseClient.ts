import got from 'got';
import qs from 'query-string';

export interface MspecsClientConfig {
  /** demo.mspecs.se or api.mspecs.se */
  host: string;
  auth: {
    username: string;
    password: string;
  };
}

export interface MspecsApiOptions<T> {
  q?: string;
  limit?: number;
  offset?: number;
  fields?: string;
  sort?: string;
  collections?: string | T[];
  strip?: boolean;
  customFields?: boolean;
}

export class MspecsBaseClient {
  constructor(private config: MspecsClientConfig) {}

  getById = async <TClass, TCollections>(
    Class: new (obj: any, client: any) => TClass,
    table: string,
    id: string | null | undefined,
    query?: MspecsApiOptions<TCollections>
  ): Promise<TClass | null> => {
    if (!id) return Promise.resolve(null);

    let q: MspecsApiOptions<TCollections> = {
      ...(query || {})
    };

    if (Array.isArray(q.collections)) {
      q.collections = q.collections.join(',');
    }

    const queryString = qs.stringify(q, { encode: false });

    const url = `${this.config.host}/${table}/${id}?${queryString}`;

    const res = await got.get(url, {
      timeout: 5000,
      auth: `${this.config.auth.username}:${this.config.auth.password}`
    });

    const parsed = JSON.parse(res.body);

    return new Class(parsed, this);
  };

  getAll = async <TClass, TCollections>(
    Class: new (obj: any, client: any) => TClass,
    table: string,
    query?: MspecsApiOptions<TCollections>
  ): Promise<TClass[]> => {
    let q: MspecsApiOptions<TCollections> = {
      limit: 50,
      ...(query || {})
    };

    if (Array.isArray(q.collections)) {
      q.collections = q.collections.join(',');
    }

    const queryString = qs.stringify(q, { encode: false });

    const url = `${this.config.host}/${table}?${queryString}`;

    const res = await got.get(url, {
      timeout: 5000,
      auth: `${this.config.auth.username}:${this.config.auth.password}`
    });

    const parsed = JSON.parse(res.body);

    return parsed.map((item: any) => new Class(item, this));
  };

  getByIds = async <TClass, TCollections>(
    Class: new (obj: any, client: any) => TClass,
    table: string,
    ids: string[] | null[] | undefined[],
    query?: MspecsApiOptions<TCollections>
  ): Promise<TClass[]> => {
    const uniqueIds = Array.from(
      new Set((ids as string[]).map(id => `'${id}'`))
    );

    if (uniqueIds.length === 0) return [];

    const encodedQuery = encodeURIComponent(`id in (${uniqueIds.join(',')})`);

    const q: MspecsApiOptions<TCollections> = {
      ...query,
      q: encodedQuery
    };

    return this.getAll(Class, table, q);
  };

  getFirst = async <TClass, TCollections>(
    Class: new (obj: any, client: any) => TClass,
    table: string,
    query?: MspecsApiOptions<TCollections>
  ): Promise<TClass> => {
    const all = await this.getAll(Class, table, { ...query, limit: 1 });

    if (all.length) {
      return all[0];
    }

    return all[0];
  };

  create = async <TClass>(
    Class: new (obj: any, client: any) => TClass,
    table: string,
    data: any
  ): Promise<TClass> => {
    try {
      const url = `${this.config.host}/${table}`;

      const res = await got.post(url, {
        body: JSON.parse(JSON.stringify(data)),
        form: true,
        auth: `${this.config.auth.username}:${this.config.auth.password}`
      });

      const instance = new Class(JSON.parse(res.body), this);

      return instance;
    } catch (err) {
      throw err;
    }
  };
}
