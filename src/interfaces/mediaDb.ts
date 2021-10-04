import { Knex } from 'knex';
import { DBClient } from './dbClient';

export abstract class MediaDB extends DBClient {
  protected typeId: number;

  constructor(db: Knex<any, unknown[]>, typeId: number) {
    super(db);
    this.typeId = typeId;
  }

  async getApiIdsNotInDB(apiIds: string[]): Promise<string[]> {
    const found = await this.db<MediumDBObject>('media')
      .select('source_api_id')
      .whereIn('source_api_id', apiIds);

    const idsNotInDB = apiIds.filter((id) => {
      return !found.map((item) => item.source_api_id).includes(id);
    });

    return idsNotInDB;
  }
}

export interface MediumDBObject {
  id?: number;
  source_name: string;
  source_api_title: string;
  source_api_id: string;
  source_api_url?: string;
  source_webpage_url?: string;
  type_id: number;
}

declare module 'knex/types/tables' {
  interface Tables {
    media: Knex.CompositeTableType<
      MediumDBObject,
      Partial<Omit<MediumDBObject, 'id'>>,
      Partial<Omit<MediumDBObject, 'id'>>
    >;
  }
}
