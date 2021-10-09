import { build } from '../helper';

describe('healthcheck route', () => {
  const app = build();

  test('should return 200 when app is online', async () => {
    const res = await app.inject({
      url: '/',
    });

    expect(res.statusCode).toEqual(200);
  });
});
