import { build } from '../../../../helper';

describe('backlog routes', () => {
  const app = build();

  test('should create a new backlog', async () => {
    // create a user
    const userPayload = {
      discord_username: 'test_username',
      discord_discriminator: '1234',
      discord_tag: 'test_username#1234',
      discord_user_id: '1235468436206186564',
    };

    const userRes = await app.inject({
      url: '/api/v1/users',
      method: 'POST',
      payload: userPayload,
    });

    const createPayload = {
      name: 'Test Backlog',
      description: 'Test description',
      user_id: userRes.json().id,
      category: 0,
    };

    const backlogRes = await app.inject({
      url: '/api/v1/backlogs',
      method: 'POST',
      payload: createPayload,
    });

    expect(backlogRes.statusCode).toBe(201);
    expect(backlogRes.json()).toMatchObject(createPayload);
  });
});
