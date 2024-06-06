import * as SQLite from 'expo-sqlite';

export const connectToDatabase = async (DB_NAME) => {
  return SQLite.openDatabaseAsync(DB_NAME);
}

export const createTables = async (db) => {
  try {
    console.log('Creating tables');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Conversation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT );
      CREATE TABLE IF NOT EXISTS Node (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        graphId INTEGER,
        name TEXT,
        FOREIGN KEY (graphId) REFERENCES Conversations(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS Link (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        graphId INTEGER,
        sourceNodeId INTEGER,
        targetNodeId INTEGER,
        FOREIGN KEY (graphId) REFERENCES Conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sourceNodeId) REFERENCES Nodes(id) ON DELETE CASCADE,
        FOREIGN KEY (targetNodeId) REFERENCES Nodes(id) ON DELETE CASCADE
      );
  `);
  console.log('Tables created');
  } catch (error) {
    console.error('Error initializing database: ', error);
  } 
}