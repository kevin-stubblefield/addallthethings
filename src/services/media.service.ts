import { Knex } from 'knex';
import { MediaDB } from '../models/media.model';

export class MediaDBService {
  readonly mediaTable = 'media';
  constructor(protected knex: Knex, public type: string) {}

  async getApiIdsNotInDB(apiIds: string[]): Promise<string[]> {
    const found = await this.knex<MediaDB>('media')
      .select('source_api_id')
      .whereIn('source_api_id', apiIds);

    const idsNotInDB = apiIds.filter((id) => {
      return !found.map((item) => item.source_api_id).includes(id);
    });

    return idsNotInDB;
  }
}
