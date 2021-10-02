import { Knex } from 'knex';
import { DBClient } from '../../../../interfaces/dbClient';

export class BacklogEntriesDB extends DBClient {
  constructor(db: Knex<any, unknown[]>) {
    super(db);
  }

  async createBacklogEntry(
    backlogEntry: BacklogEntryRequestDTO
  ): Promise<BacklogEntryResponseDTO> {
    return await this.db<BacklogEntryDBObject>('backlog_entries')
      .returning(['id', 'backlog_id', 'media_id', 'status'])
      .insert(backlogEntry);
  }

  async updateBacklogEntry(
    id: number,
    status: BacklogEntryStatus
  ): Promise<BacklogEntryResponseDTO> {
    const result = await this.db<BacklogEntryDBObject>('backlog_entries')
      .where('id', id)
      .update({ status, updated_at: new Date() }, [
        'id',
        'backlog_id',
        'media_id',
        'status',
      ]);

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
  NotStarted,
  InProgress,
  Complete,
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
>;

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
