import { Knex } from 'knex';
import { MediaDB, Medium } from '../../../../interfaces/mediaDb';

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
