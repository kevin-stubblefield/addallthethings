import { Knex } from 'knex';
import { DBClient } from '../../../../interfaces/dbClient';

export class UsersDB extends DBClient {
  constructor(db: Knex<any, unknown[]>) {
    super(db);
  }

  async getUserByDiscordId(discordId: string): Promise<UserResponseDTO> {
    const result = await this.db<UserDBObject>('users')
      .select('*')
      .where('discord_user_id', discordId);

    return result[0];
  }
}

interface UserDBObject {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  discord_username: string;
  discord_discriminator: string;
  discord_tag: string;
  discord_user_id: string;
  created_at: Date;
  updated_at: Date;
}

export type UserRequestDTO = Pick<
  UserDBObject,
  | 'username'
  | 'password_hash'
  | 'email'
  | 'discord_username'
  | 'discord_discriminator'
  | 'discord_tag'
  | 'discord_user_id'
  | 'updated_at'
>;

type UserResponseDTO = Pick<
  UserDBObject,
  | 'id'
  | 'username'
  | 'password_hash'
  | 'email'
  | 'discord_username'
  | 'discord_discriminator'
  | 'discord_tag'
  | 'discord_user_id'
>;

declare module 'knex/types/tables' {
  interface Tables {
    users: Knex.CompositeTableType<
      UserDBObject,
      Partial<Omit<UserDBObject, 'id' | 'created_at' | 'updated_at'>>,
      Partial<Omit<UserDBObject, 'id' | 'created_at'>>
    >;
  }
}
