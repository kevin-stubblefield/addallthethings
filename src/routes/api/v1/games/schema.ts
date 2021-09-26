export const GameSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    cover: {
      type: 'object',
      properties: { url: { type: 'string' } },
    },
    name: { type: 'string' },
    rating: { type: 'number' },
    first_release_date: { type: 'number' },
  },
};
