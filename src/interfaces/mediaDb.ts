import { Knex } from 'knex';

export abstract class MediaDB {
  protected db: Knex<any, unknown[]>;
  protected typeId: number;

  constructor(db: Knex<any, unknown[]>, typeId: number) {
    this.db = db;
    this.typeId = typeId;
  }
}

export interface Medium {
  id?: number;
  source_name: string;
  source_api_url: string;
  source_api_id: string;
  type_id: number;
}

declare module 'knex/types/tables' {
  interface Tables {
    media: Knex.CompositeTableType<
      Medium,
      Partial<Omit<Medium, 'id'>>,
      Partial<Omit<Medium, 'id'>>
    >;
  }
}
