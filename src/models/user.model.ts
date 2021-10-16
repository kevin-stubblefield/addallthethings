export interface UserDB {
  id?: number;
  username?: string;
  password_hash?: string;
  email?: string;
  discord_username?: string;
  discord_discriminator?: string;
  discord_tag?: string;
  discord_user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
