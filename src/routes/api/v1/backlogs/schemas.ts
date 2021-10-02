export const BacklogSchema = {
  type: 'object',
  required: ['id', 'name', 'description', 'user_id', 'category'],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: 'string' },
    user_id: { type: 'integer', minimum: 1 },
    category: { type: 'integer', minimum: 0 },
  },
};

export const BacklogEntrySchema = {
  type: 'object',
  required: ['id', 'backlog_id', 'media_id', 'status'],
  properties: {
    id: { type: 'integer' },
    backlog_id: { type: 'integer' },
    media_id: { type: 'integer' },
    status: { type: 'integer' },
  },
};
