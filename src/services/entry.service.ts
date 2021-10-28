import { Knex } from 'knex';
import { EntryDB, EntryStatus } from '../models/entry.model';

export class EntryService {
  readonly entryTable = 'backlog_entries';
  constructor(private knex: Knex) {}

  async createBacklogEntry(backlogEntry: EntryDB): Promise<EntryDB> {
    const result = await this.knex('backlog_entries')
      .returning(['*'])
      .insert<EntryDB[]>(backlogEntry);

    return result[0];
  }

  async getBacklogEntries(backlog_id: number): Promise<EntryDB[]> {
    return await this.knex<EntryDB>('backlog_entries')
      .select('backlog_entries.*', 'media.source_api_title')
      .join('media', 'backlog_entries.media_id', 'media.id')
      .where('backlog_entries.backlog_id', backlog_id);
  }

  async updateBacklogEntry(id: number, status: EntryStatus): Promise<EntryDB> {
    const result = await this.knex('backlog_entries')
      .where('id', id)
      .returning(['*'])
      .update<EntryDB[]>({ status, updated_at: new Date() });

    return result[0];
  }

  async deleteBacklogEntry(id: number): Promise<void> {
    await this.knex<EntryDB>('backlog_entries').where('id', id).delete();
  }

  async backlogEntryExists(id: number): Promise<boolean> {
    const result = await this.knex<EntryDB>('backlog_entries')
      .select('id')
      .where('id', id);

    return result.length > 0;
  }
}
