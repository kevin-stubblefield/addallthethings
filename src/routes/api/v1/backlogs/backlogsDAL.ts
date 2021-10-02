import { Knex } from 'knex';
import { DBClient } from '../../../../interfaces/dbClient';

export class BacklogsDB extends DBClient {
  constructor(db: Knex<any, unknown[]>) {
    super(db);
  }

  async createBacklog(
    backlog: any
  ): Promise<
    Pick<BacklogDTO, 'id' | 'name' | 'description' | 'user_id' | 'category'>
  > {
    return await this.db<BacklogDTO>('backlogs')
      .returning(['id', 'name', 'description', 'user_id', 'category'])
      .insert(backlog);
  }

  async getBacklogs(
    userId: number,
    limit: number,
    offset: number
  ): Promise<
    Pick<BacklogDTO, 'id' | 'name' | 'description' | 'user_id' | 'category'>[]
  > {
    return await this.db<BacklogDTO>('backlogs')
      .select('id', 'name', 'description', 'user_id', 'category')
      .where('user_id', userId)
      .limit(limit)
      .offset(offset);
  }
}

export interface BacklogDTO {
  id: number;
  name: string;
  description: string;
  user_id: number;
  category: BacklogCategory;
  created_at: Date;
  updated_at: Date;
}

export enum BacklogCategory {
  Any,
  Game,
  TVShow,
  Movie,
  Anime,
}

declare module 'knex/types/tables' {
  interface Tables {
    backlogs: Knex.CompositeTableType<
      BacklogDTO,
      Partial<Omit<BacklogDTO, 'id' | 'created_at' | 'updated_at'>>,
      Partial<Omit<BacklogDTO, 'id' | 'created_at'>>
    >;
  }
}
