import {
  build,
  createTestBacklog,
  createTestGames,
  createTestUser,
  getGames,
} from '../../../../helper';

describe('backlog routes', () => {
  const app = build();

  test('should create a new backlog', async () => {
    const userObject = await createTestUser(app);

    const createPayload = {
      name: 'Test Backlog',
      description: 'Test description',
      user_id: userObject.json().id,
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

  test('should return all backlogs for a given user', async () => {
    const userObject = await createTestUser(app);

    const backlogObject = await createTestBacklog(app, userObject);
    await createTestBacklog(app, userObject);

    const backlogRes = await app.inject({
      url: `/api/v1/backlogs?userId=${userObject.json().id}`,
      method: 'GET',
    });

    expect(backlogRes.statusCode).toBe(200);
    expect(backlogRes.json()).toHaveLength(2);
    expect(backlogRes.json()[0]).toMatchObject(backlogObject.json());
  });

  test('should return a specified backlog', async () => {
    const userObject = await createTestUser(app);

    const backlogObject = await createTestBacklog(app, userObject);

    const backlogRes = await app.inject({
      url: `/api/v1/backlogs/${backlogObject.json().id}`,
      method: 'GET',
    });

    expect(backlogRes.statusCode).toBe(200);
    expect(backlogRes.json()).toMatchObject(backlogObject.json());
  });

  test('should update the specified backlog', async () => {
    const userObject = await createTestUser(app);

    const backlogObject = await createTestBacklog(app, userObject);

    const updatePayload = {
      name: 'Updated Test Backlog',
      description: 'Updated test description',
      category: 1,
    };

    const backlogRes = await app.inject({
      url: `/api/v1/backlogs/${backlogObject.json().id}`,
      method: 'PATCH',
      payload: updatePayload,
    });

    expect(backlogRes.statusCode).toBe(200);
    expect(backlogRes.json()).toMatchObject(updatePayload);
  });

  test('should delete the specified backlog', async () => {
    const userObject = await createTestUser(app);

    const backlogObject = await createTestBacklog(app, userObject);

    const backlogRes = await app.inject({
      url: `/api/v1/backlogs/${backlogObject.json().id}`,
      method: 'DELETE',
    });

    expect(backlogRes.statusCode).toBe(204);
  });
});

describe('backlog entry routes', () => {
  const app = build();

  test('should create entry in backlog', async () => {
    const userObject = await createTestUser(app);
    await createTestGames(app);
    const backlogObject = await createTestBacklog(app, userObject);
    const games = await getGames(app);

    const entryPayload = {
      media_id: games.json()[0].id,
      status: 0,
    };

    const entryRes = await app.inject({
      url: `/api/v1/backlogs/${backlogObject.json().id}/entries`,
      method: 'POST',
      payload: entryPayload,
    });

    expect(entryRes.statusCode).toBe(201);
    expect(entryRes.json().media_id).toBe(entryPayload.media_id);
    expect(entryRes.json().backlog_id).toBe(backlogObject.json().id);
    expect(entryRes.json().status).toBe(entryPayload.status);
  });
});
