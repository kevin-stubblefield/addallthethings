import { Knex } from 'knex';
import { MediaDB, MediumDBObject } from '../../../../interfaces/mediaDb';
import { GameApiDto } from './DTOs';

export class GamesDB extends MediaDB {
  constructor(db: Knex<any, unknown[]>) {
    super(db, 1);
  }

  async createGames(games: GameApiDto[], sourceName: string): Promise<void> {
    const gamesNotInDB = await this.getApiIdsNotInDB(
      games.map((game) => game.id.toString())
    );

    const gamesToInsert = games
      .filter((game) => gamesNotInDB.includes(game.id.toString()))
      .map((game) => {
        const gameToInsert: MediumDBObject = {
          source_name: sourceName,
          source_api_id: game.id.toString(),
          source_api_title: game.name,
          source_webpage_url: game.url,
          type_id: this.typeId,
        };

        return gameToInsert;
      });

    if (gamesToInsert.length > 0) {
      await this.db<MediumDBObject>('media').insert(gamesToInsert);
    }
  }
}
