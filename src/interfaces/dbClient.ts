import { Knex } from 'knex';

export abstract class DBClient {
  protected db: Knex<any, unknown[]>;

  constructor(db: Knex<any, unknown[]>) {
    this.db = db;
  }
}
