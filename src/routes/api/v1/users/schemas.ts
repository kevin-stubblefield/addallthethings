export const UserSchema = {
  type: 'object',
  required: [
    'id',
    'username',
    'email',
    'discord_username',
    'discord_discriminator',
    'discord_tag',
    'discord_user_id',
  ],
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string' },
    discord_username: { type: 'string' },
    discord_discriminator: { type: 'string' },
    discord_tag: { type: 'string' },
    discord_user_id: { type: 'string' },
  },
};
