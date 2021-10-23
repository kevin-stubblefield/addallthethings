import {
  build,
  createTestBacklog,
  createTestBacklogEntry,
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
      category: 'any',
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
      url: `/api/v1/backlogs?user_id=${userObject.json().id}`,
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
      category: 'game',
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
      status: 'not_started',
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

  test('create entry should 404 when media not found', async () => {
    const userObject = await createTestUser(app);
    const backlogObject = await createTestBacklog(app, userObject);

    const entryPayload = {
      media_id: 0,
      status: 'not_started',
    };

    const entryRes = await app.inject({
      url: `/api/v1/backlogs/${backlogObject.json().id}/entries`,
      method: 'POST',
      payload: entryPayload,
    });

    expect(entryRes.statusCode).toBe(404);
  });

  test('should return entries in a specified backlog', async () => {
    const userObject = await createTestUser(app);
    await createTestGames(app);
    const backlogObject = await createTestBacklog(app, userObject);
    const games = await getGames(app);
    const backlogId = backlogObject.json().id;

    const entryPayload = {
      media_id: games.json()[0].id,
      status: 'not_started',
    };

    await app.inject({
      url: `/api/v1/backlogs/${backlogId}/entries`,
      method: 'POST',
      payload: entryPayload,
    });

    entryPayload.media_id += 1;

    await app.inject({
      url: `/api/v1/backlogs/${backlogId}/entries`,
      method: 'POST',
      payload: entryPayload,
    });

    const entryRes = await app.inject({
      url: `/api/v1/backlogs/${backlogId}/entries`,
      method: 'GET',
    });

    expect(entryRes.statusCode).toBe(200);
    expect(entryRes.json()).toHaveLength(2);
  });

  test('should 404 if backlog not found', async () => {
    const entryRes = await app.inject({
      url: `/api/v1/backlogs/0/entries`,
      method: 'GET',
    });

    expect(entryRes.statusCode).toBe(404);
  });

  test('should update backlog entry', async () => {
    const userObject = await createTestUser(app);
    const backlogObject = await createTestBacklog(app, userObject);
    const games = await getGames(app);

    const entryObject = await createTestBacklogEntry(
      app,
      backlogObject,
      games.json()[0].id
    );

    const updatePayload = {
      status: 'in_progress',
    };

    const entryRes = await app.inject({
      url: `/api/v1/backlogs/entries/${entryObject.json().id}`,
      method: 'PATCH',
      payload: updatePayload,
    });

    expect(entryRes.statusCode).toBe(200);
    expect(entryRes.json().status).toBe(updatePayload.status);
  });

  test('should delete backlog entry', async () => {
    const userObject = await createTestUser(app);
    const backlogObject = await createTestBacklog(app, userObject);
    const games = await getGames(app);

    const entryObject = await createTestBacklogEntry(
      app,
      backlogObject,
      games.json()[0].id
    );

    const entryRes = await app.inject({
      url: `/api/v1/backlogs/entries/${entryObject.json().id}`,
      method: 'DELETE',
    });

    expect(entryRes.statusCode).toBe(204);
  });
});
