import { Knex } from 'knex';

abstract class MediaDB {
  protected db: Knex<any, unknown[]>;
  protected typeId: number;

  constructor(db: Knex<any, unknown[]>, typeId: number) {
    this.db = db;
    this.typeId = typeId;
  }
}

export class GamesDB extends MediaDB {
  constructor(db: Knex<any, unknown[]>) {
    super(db, 1);
  }

  async createGames(games: any[]) {
    let gamesToInsert = games.map((game) => {
      let gameToInsert: Medium = {
        source_api_id: game.id,
        source_name: game.name,
        source_api_url: game.url,
        type_id: this.typeId,
      };

      return gameToInsert;
    });

    await this.db<Medium>('media').insert(gamesToInsert);
  }
}

export interface Medium {
  id?: number;
  source_name: string;
  source_api_url: string;
  source_api_id: string;
  type_id: number;
}

declare module 'knex/types/tables' {
  interface Tables {
    media: Knex.CompositeTableType<
      Medium,
      Partial<Omit<Medium, 'id'>>,
      Partial<Omit<Medium, 'id'>>
    >;
  }
}
