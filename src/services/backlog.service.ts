import { Knex } from 'knex';
import { BacklogDB, BacklogDBWithDiscordId } from '../models/backlog.model';

export class BacklogService {
  readonly backlogTable = 'backlogs';
  constructor(private knex: Knex) {}

  async createBacklog(backlog: BacklogDBWithDiscordId): Promise<BacklogDB> {
    const result = await this.knex('backlogs')
      .returning(['id', 'name', 'description', 'user_id', 'category'])
      .insert<BacklogDB[]>(backlog);

    return result[0];
  }

  async getBacklogs(
    user_id: number,
    limit: number,
    offset: number
  ): Promise<BacklogDB[]> {
    return await this.knex<BacklogDB>('backlogs')
      .select('*')
      .where('user_id', user_id)
      .limit(limit)
      .offset(offset);
  }

  async getBacklog(id: number): Promise<BacklogDB> {
    const result = await this.knex<BacklogDB>('backlogs')
      .select('*')
      .where('id', id);

    return result[0];
  }

  async updateBacklog(id: number, backlog: BacklogDB): Promise<BacklogDB> {
    backlog.updated_at = new Date();

    const result = await this.knex<BacklogDB>('backlogs')
      .where('id', id)
      .returning(['id', 'name', 'description', 'user_id', 'category'])
      .update<BacklogDB[]>(backlog);

    return result[0];
  }

  async deleteBacklog(id: number): Promise<void> {
    await this.knex<BacklogDB>('backlogs').where('id', id).delete();
  }

  async backlogExists(id: number): Promise<boolean> {
    const result = await this.knex<BacklogDB>('backlogs')
      .select('id')
      .where('id', id);

    return result.length > 0;
  }
}
