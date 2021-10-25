import { Knex } from 'knex';
import { MediaDB, GameApi } from '../models/media.model';
import { MediaDBService } from './media.service';

export class GameDBService extends MediaDBService {
  constructor(protected knex: Knex) {
    super(knex, 'game');
  }

  async createGames(games: GameApi[], sourceName: string): Promise<void> {
    const gamesNotInDB = await this.getApiIdsNotInDB(
      games.map((game) => game.id.toString())
    );

    const gamesToInsert = games
      .filter((game) => gamesNotInDB.includes(game.id.toString()))
      .map((game) => {
        const gameToInsert: MediaDB = {
          source_name: sourceName,
          source_api_id: game.id.toString(),
          source_api_title: game.name,
          source_webpage_url: game.url,
          type: this.type,
        };

        return gameToInsert;
      });

    if (gamesToInsert.length > 0) {
      await this.knex<MediaDB>('media').insert(gamesToInsert);
    }
  }

  async getGames(): Promise<MediaDB[]> {
    return await this.knex('media').where('type', 'game');
  }

  async getGameByApiId(game_id: string): Promise<MediaDB> {
    return await this.knex('media')
      .where('type', 'game')
      .andWhere('source_api_id', game_id)
      .first();
  }
}
