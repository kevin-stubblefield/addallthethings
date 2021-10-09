import { build } from '../../../../helper';

describe('create discord user route', () => {
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
    expect(res.json().discord_username).toBe(requestPayload.discord_username);
    expect(res.json().discord_discriminator).toBe(
      requestPayload.discord_discriminator
    );
    expect(res.json().discord_tag).toBe(requestPayload.discord_tag);
    expect(res.json().discord_user_id).toBe(requestPayload.discord_user_id);
  });
});
