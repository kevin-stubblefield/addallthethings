import { test } from 'tap';
import { build } from '../helper';

test('healthcheck route', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: '/',
  });

  t.equal(res.statusCode, 200);
});
