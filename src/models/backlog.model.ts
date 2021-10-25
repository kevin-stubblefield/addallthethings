import { EntryDB } from './entry.model';

export interface BacklogDB {
  id?: number;
  name?: string;
  description?: string;
  user_id?: number;
  category?: string;
  privacy?: string;
  created_at?: Date;
  updated_at?: Date;
  entries?: EntryDB[];
}
