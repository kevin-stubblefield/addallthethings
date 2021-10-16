import { Knex } from 'knex';
import { UserDB } from '../models/user.model';

export class UserService {
  readonly userTable = 'users';
  constructor(private knex: Knex) {}

  async getUserByDiscordId(discordId: string): Promise<UserDB> {
    return await this.knex(this.userTable)
      .select('*')
      .where('discord_user_id', discordId)
      .first<UserDB>();
  }

  async insertDiscordUser(user: UserDB): Promise<UserDB> {
    const result = await this.knex<UserDB>(this.userTable).insert(user, ['*']);

    return result[0];
  }
}
