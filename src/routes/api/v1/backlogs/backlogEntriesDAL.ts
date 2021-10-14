import { Knex } from 'knex';
import { DBClient } from '../../../../interfaces/dbClient';

export class BacklogEntriesDB extends DBClient {
  constructor(db: Knex<any, unknown[]>) {
    super(db);
  }

  async createBacklogEntry(
    backlogEntry: BacklogEntryRequestDTO
  ): Promise<BacklogEntryResponseDTO> {
    const result = await this.db('backlog_entries')
      .returning(['id', 'backlog_id', 'media_id', 'status'])
      .insert<BacklogEntryResponseDTO[]>(backlogEntry);

    return result[0];
  }

  async getBacklogEntries(
    backlog_id: number
  ): Promise<BacklogEntryResponseDTO[]> {
    return await this.db<BacklogEntryDBObject>('backlog_entries')
      .select('*')
      .join('media', 'backlog_entries.media_id', 'media.id')
      .where('backlog_entries.backlog_id', backlog_id);
  }

  async updateBacklogEntry(
    id: number,
    status: BacklogEntryStatus
  ): Promise<BacklogEntryResponseDTO> {
    const result = await this.db('backlog_entries')
      .where('id', id)
      .returning(['id', 'backlog_id', 'media_id', 'status'])
      .update<BacklogEntryResponseDTO[]>({ status, updated_at: new Date() });

    return result[0];
  }

  async deleteBacklogEntry(id: number): Promise<void> {
    await this.db<BacklogEntryDBObject>('backlog_entries')
      .where('id', id)
      .delete();
  }

  async backlogEntryExists(id: number): Promise<boolean> {
    const result = await this.db<BacklogEntryDBObject>('backlog_entries')
      .select('id')
      .where('id', id);

    return result.length > 0;
  }
}

export enum BacklogEntryStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
}

interface BacklogEntryDBObject {
  id: number;
  backlog_id: number;
  media_id: number;
  status: BacklogEntryStatus;
  created_at: Date;
  updated_at?: Date;
}

export type BacklogEntryRequestDTO = Pick<
  BacklogEntryDBObject,
  'backlog_id' | 'media_id' | 'status' | 'updated_at'
> & { source_api_id?: string };

export type BacklogEntryResponseDTO = Pick<
  BacklogEntryDBObject,
  'backlog_id' | 'media_id' | 'status'
>;

declare module 'knex/types/tables' {
  interface Tables {
    backlog_entries: Knex.CompositeTableType<
      BacklogEntryDBObject,
      Partial<Omit<BacklogEntryDBObject, 'id' | 'created_at' | 'updated_at'>>,
      Partial<Omit<BacklogEntryDBObject, 'id' | 'created_at'>>
    >;
  }
}
