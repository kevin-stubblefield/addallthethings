import { build, createTestUser } from '../../../../helper';

describe('backlog routes', () => {
  const app = build();

  test('should create a new backlog', async () => {
    const userRes = await createTestUser(app);

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
