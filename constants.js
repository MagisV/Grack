// DB SCHEMA

export const CONVERSATION = 'Conversation';
export const NODE = 'Node';
export const LINK = 'Link';

export const SEED = true;
export const RE_SEED = false; // if SEED is true and the db already contains data, set RE_SEED to true to delete all rows and reseed the db
export const DB_NAME = 'graph.db';
