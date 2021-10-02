import { Knex } from 'knex';
import { DBClient } from './dbClient';

export abstract class MediaDB extends DBClient {
  protected typeId: number;

  constructor(db: Knex<any, unknown[]>, typeId: number) {
    super(db);
    this.typeId = typeId;
  }
}

export interface MediumDTO {
  id?: number;
  source_name: string;
  source_api_url: string;
  source_api_id: string;
  type_id: number;
}

declare module 'knex/types/tables' {
  interface Tables {
    media: Knex.CompositeTableType<
      MediumDTO,
      Partial<Omit<MediumDTO, 'id'>>,
      Partial<Omit<MediumDTO, 'id'>>
    >;
  }
}
