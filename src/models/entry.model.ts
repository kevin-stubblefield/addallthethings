export interface EntryDB {
  id?: number;
  backlog_id?: number;
  media_id?: number;
  status?: EntryStatus;
  created_at?: Date;
  updated_at?: Date;
}

export enum EntryStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
}
