export const APIGameSchema = {
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

export const DBGameSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    source_name: { type: 'string' },
    source_api_title: { type: 'string' },
    source_api_url: { type: 'string' },
    source_api_id: { type: 'string' },
    source_webpage_url: { type: 'string' },
    type: { type: 'string' },
  },
};
