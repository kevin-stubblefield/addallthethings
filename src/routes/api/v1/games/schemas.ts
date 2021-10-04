export const GameSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    cover: {
      type: 'object',
      properties: { url: { type: 'string' } },
    },
    name: { type: 'string' },
    rating: { type: 'number' },
    url: { type: 'string' },
    first_release_date: { type: 'number' },
  },
};
