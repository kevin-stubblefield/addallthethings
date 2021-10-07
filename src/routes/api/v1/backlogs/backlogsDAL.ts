import { Knex } from 'knex';
import { DBClient } from '../../../../interfaces/dbClient';
import { UserDBObject } from '../users/usersDAL';

export class BacklogsDB extends DBClient {
  constructor(db: Knex<any, unknown[]>) {
    super(db);
  }

  async createBacklog(
    backlog: BacklogRequestDTO | DiscordBacklogRequestDTO
  ): Promise<BacklogResponseDTO> {
    let user_id: number;
    if ('discord_user_id' in backlog) {
      let result = await this.db<UserDBObject>('users')
        .where('discord_user_id', backlog.discord_user_id)
        .select('id');

      user_id = result[0].id;

      if (user_id !== null) {
        backlog.user_id = user_id;
        delete backlog.discord_user_id;
      } else {
        throw new Error('User not found');
      }
    }

    return await this.db<BacklogDBObject>('backlogs')
      .returning(['id', 'name', 'description', 'user_id', 'category'])
      .insert(backlog);
  }

  async getBacklogs(
    userId: number,
    limit: number,
    offset: number
  ): Promise<BacklogResponseDTO[]> {
    return await this.db<BacklogDBObject>('backlogs')
      .select('*')
      .where('user_id', userId)
      .limit(limit)
      .offset(offset);
  }

  async getBacklog(id: number): Promise<BacklogResponseDTO> {
    const result = await this.db<BacklogDBObject>('backlogs')
      .select('*')
      .where('id', id);

    return result[0];
  }

  async updateBacklog(
    id: number,
    backlog: BacklogRequestDTO
  ): Promise<BacklogResponseDTO> {
    backlog.updated_at = new Date();

    const result = await this.db<BacklogDBObject>('backlogs')
      .where('id', id)
      .update(backlog, ['id', 'name', 'description', 'user_id', 'category']);

    return result[0];
  }

  async deleteBacklog(id: number): Promise<void> {
    await this.db<BacklogDBObject>('backlogs').where('id', id).delete();
  }

  async backlogExists(id: number): Promise<boolean> {
    const result = await this.db<BacklogDBObject>('backlogs')
      .select('id')
      .where('id', id);

    return result.length > 0;
  }
}

export interface BacklogDBObject {
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

export type BacklogRequestDTO = Pick<
  BacklogDBObject,
  'name' | 'description' | 'user_id' | 'category' | 'updated_at'
>;

export type DiscordBacklogRequestDTO = BacklogRequestDTO & {
  discord_user_id?: string;
};

type BacklogResponseDTO = Pick<
  BacklogDBObject,
  'id' | 'name' | 'description' | 'user_id' | 'category'
>;

declare module 'knex/types/tables' {
  interface Tables {
    backlogs: Knex.CompositeTableType<
      BacklogDBObject,
      Partial<Omit<BacklogDBObject, 'id' | 'created_at' | 'updated_at'>>,
      Partial<Omit<BacklogDBObject, 'id' | 'created_at'>>
    >;
  }
}
