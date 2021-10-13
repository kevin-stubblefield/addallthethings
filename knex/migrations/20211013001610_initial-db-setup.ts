import { Knex } from 'knex';

const userTable = 'users';
const backlogTable = 'backlogs';
const mediaTypeTable = 'media_types';
const mediaTable = 'media';
const entryTable = 'backlog_entries';

const empty = '';

export async function up(knex: Knex): Promise<void> {
  let exists = await knex.schema.hasTable(userTable);
  if (!exists) {
    await knex.schema.createTable(userTable, (table) => {
      table.increments('id');
      table.string('username', 60).notNullable().defaultTo(empty);
      table.text('password_hash').notNullable().defaultTo(empty);
      table.string('email', 120).notNullable().defaultTo(empty);
      table.string('discord_username', 40).notNullable().defaultTo(empty);
      table.string('discord_discriminator', 6).notNullable().defaultTo(empty);
      table.string('discord_tag', 46).notNullable().defaultTo(empty);
      table.string('discord_user_id', 25).notNullable().defaultTo(empty);
      table.timestamps(true, true);
    });
  }

  exists = await knex.schema.hasTable(backlogTable);
  if (!exists) {
    await knex.schema.createTable(backlogTable, (table) => {
      table.increments('id');
      table.string('name', 50).notNullable().defaultTo('New Backlog');
      table.text('description').notNullable().defaultTo(empty);
      table.integer('user_id').unsigned();
      table.string('category').notNullable().defaultTo('any');
      table
        .string('privacy')
        .notNullable()
        .defaultTo('public')
        .comment('public|friends|private');
      table.timestamps(true, true);
      table
        .foreign('user_id')
        .references(`${userTable}.id`)
        .onDelete('CASCADE');
    });
  }

  exists = await knex.schema.hasTable(mediaTypeTable);
  if (!exists) {
    await knex.schema.createTable(mediaTypeTable, (table) => {
      table.increments('id');
      table.string('label', 50).notNullable().unique();
      table.boolean('is_global').notNullable().defaultTo(false);
      table.integer('user_id').unsigned();
      table
        .foreign('user_id')
        .references(`${userTable}.id`)
        .onDelete('CASCADE');
    });
  }

  exists = await knex.schema.hasTable(mediaTable);
  if (!exists) {
    await knex.schema.createTable(mediaTable, (table) => {
      table.increments('id');
      table.string('source_name', 50).notNullable();
      table.string('source_api_title').notNullable();
      table.string('source_api_url').notNullable().defaultTo(empty);
      table.string('source_api_id').notNullable();
      table.string('type');
      table.unique(['source_name', 'source_api_id'], {
        indexName: 'media_unique_source_name_id_index',
      });
      table
        .foreign('type')
        .references(`${mediaTypeTable}.label`)
        .onDelete('SET NULL');
    });
  }

  exists = await knex.schema.hasTable(entryTable);
  if (!exists) {
    await knex.schema.createTable(entryTable, (table) => {
      table.increments('id');
      table.integer('backlog_id').unsigned();
      table.integer('media_id').unsigned();
      table
        .string('status')
        .notNullable()
        .defaultTo('not_started')
        .comment('not_started|in_progress|completed');
      table.timestamps(true, true);
      table
        .foreign('backlog_id')
        .references(`${backlogTable}.id`)
        .onDelete('CASCADE');
      table
        .foreign('media_id')
        .references(`${mediaTable}.id`)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(entryTable);
  await knex.schema.dropTableIfExists(mediaTable);
  await knex.schema.dropTableIfExists(mediaTypeTable);
  await knex.schema.dropTableIfExists(backlogTable);
  await knex.schema.dropTableIfExists(userTable);
}
