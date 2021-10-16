import { Knex } from 'knex';
import { UserService } from './user.service';

export const services = (db: Knex) => {
  return {
    userService: new UserService(db),
  };
};
