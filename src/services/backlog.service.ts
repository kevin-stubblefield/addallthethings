import { Knex } from 'knex';
import { BacklogDB } from '../models/backlog.model';

export class BacklogService {
  readonly backlogTable = 'backlogs';
  constructor(private knex: Knex) {}

  async createBacklog(backlog: BacklogDB): Promise<BacklogDB> {
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

    if (backlog.is_selected) {
      await this.knex('backlogs')
        .where('id', '<>', id)
        .andWhere('user_id', result[0].user_id)
        .update({ is_selected: false });
    }

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

  async getSelectedBacklog(user_id: number): Promise<BacklogDB | undefined> {
    return await this.knex<BacklogDB>('backlogs')
      .select('*')
      .where('user_id', user_id)
      .andWhere('is_selected', true)
      .first();
  }
}
