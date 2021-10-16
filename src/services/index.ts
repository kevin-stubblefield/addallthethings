import { Knex } from 'knex';
import { BacklogService } from './backlog.service';
import { EntryService } from './entry.service';
import { GameDBService } from './game.service';
import { UserService } from './user.service';

export const services = (db: Knex) => {
  return {
    userService: new UserService(db),
    backlogService: new BacklogService(db),
    entryService: new EntryService(db),
    gameDBService: new GameDBService(db),
  };
};
