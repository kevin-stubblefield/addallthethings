import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const userTable = 'users';
  const mediaTypeTable = 'media_types';

  const winter = [
    {
      username: 'Winterfresh',
      discord_username: 'Winterfresh92',
      discord_discriminator: '0961',
      discord_tag: 'Winterfresh92#0961',
      discord_user_id: '313060065181433867',
    },
  ];

  const mediaTypes = [
    { label: 'Game', is_global: true, created_by: 1 },
    { label: 'TV Show', is_global: true, created_by: 1 },
    { label: 'Movie', is_global: true, created_by: 1 },
    { label: 'Anime', is_global: true, created_by: 1 },
  ];

  // Deletes ALL existing entries
  await knex(mediaTypeTable).del();
  await knex(userTable).del();

  // Inserts seed entries
  await knex(userTable).insert(winter);
  await knex(mediaTypeTable).insert(mediaTypes);
}
