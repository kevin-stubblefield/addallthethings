import { build } from '../../../../helper';

describe('user routes', () => {
  const app = build();

  test('should create a user with discord information', async () => {
    const requestPayload = {
      discord_username: 'test_username',
      discord_discriminator: '1234',
      discord_tag: 'test_username#1234',
      discord_user_id: '1235468436206186564',
    };

    const res = await app.inject({
      url: '/api/v1/users',
      method: 'POST',
      payload: requestPayload,
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject(requestPayload);
  });

  test('should return error if new user already exists', async () => {
    const requestPayload = {
      discord_username: 'test_username',
      discord_discriminator: '1234',
      discord_tag: 'test_username#1234',
      discord_user_id: '1235468436206186564',
    };

    let res = await app.inject({
      url: '/api/v1/users',
      method: 'POST',
      payload: requestPayload,
    });

    res = await app.inject({
      url: '/api/v1/users',
      method: 'POST',
      payload: requestPayload,
    });

    expect(res.statusCode).toBe(409);
  });

  test('should retrieve a user by their discord id', async () => {
    // create user to be retrieved
    const expected = {
      discord_username: 'test_username',
      discord_discriminator: '1234',
      discord_tag: 'test_username#1234',
      discord_user_id: '1235468436206186564',
    };

    await app.inject({
      url: '/api/v1/users',
      method: 'POST',
      payload: expected,
    });

    const res = await app.inject({
      url: `/api/v1/users/${expected.discord_user_id}`,
      method: 'GET',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject(expected);
  });
});
