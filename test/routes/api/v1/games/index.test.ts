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
});
