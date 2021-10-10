import { build } from '../../../../helper';

describe('games routes', () => {
  const app = build();

  test('should return games from db', async () => {
    const gamesRes = await app.inject({
      url: '/api/v1/games',
      method: 'GET',
    });

    expect(gamesRes.statusCode).toBe(200);
    expect(gamesRes.json().length).toBeGreaterThan(0);
  });

  test('should retrieve games from api', async () => {
    const gamesPayload = {
      ids: [114283, 144051, 19614, 119257, 146112, 6706, 45165],
    };

    const gamesRes = await app.inject({
      url: '/api/v1/games',
      method: 'POST',
      payload: gamesPayload,
    });

    expect(gamesRes.statusCode).toBe(200);
    expect(gamesRes.json().length).toBe(7);
  });

  test('should return search results from api', async () => {
    const searchRes = await app.inject({
      url: 'api/v1/games/search?query=legend of zelda',
      method: 'GET',
    });

    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.json().length).toBeGreaterThan(0);
  });
});
