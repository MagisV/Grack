import { CONVERSATION, NODE, LINK } from '../constants';

export const insertConversation = async (db, name) => {
  const insertConversation = await db.prepareAsync(`
      INSERT INTO ${CONVERSATION} (name) VALUES ($name)`
  );

  try {
      // console.log('Adding conversation');
      const result = insertConversation.executeAsync({ $name: name });
      const conversationId = (await result).lastInsertRowId;
      // console.log('Inserted conversation', conversationId, (await result).changes);
      return conversationId;
  } catch (error) {
      console.log('Error adding conversation: ', error);
  } finally {
      insertConversation.finalizeAsync();
  }
  return null;
}

export const insertNode = async (db, graphId, name) => {
  const insertNode = await db.prepareAsync(`
      INSERT INTO ${NODE} (graphId, name) VALUES ($graphId, $name)`
  );

  try {
      // console.log('Adding node');
      const result = insertNode.executeAsync({ $graphId: graphId, $name: name });
      const nodeId = (await result).lastInsertRowId;
      console.log('Inserted node', nodeId, (await result).changes);
      return nodeId;
  } catch (error) {
      console.log('Error adding node: ', error);
  } finally {
      insertNode.finalizeAsync();
  }
  return null;
}

export const insertLink = async (db, graphId, sourceNodeId, targetNodeId) => {
  const insertLink = await db.prepareAsync(`
      INSERT INTO ${LINK} (graphId, sourceNodeId, targetNodeId) VALUES ($graphId, $sourceNodeId, $targetNodeId)`
  );

  try {
      // console.log('Adding link');
      const result = insertLink.executeAsync({ $graphId: graphId, $sourceNodeId: sourceNodeId, $targetNodeId: targetNodeId });
      const linkId = (await result).lastInsertRowId;
      console.log('Inserted link', linkId, (await result).changes);
      return linkId;
  } catch (error) {
      console.log('Error adding link: ', error);
  } finally {
      insertLink.finalizeAsync();
  }
  return null;
}

// delete all conversations, nodes and links
export const deleteAll = async (db) => {
  try {
    console.log('Deleting all data');
    await db.execAsync(`
      DELETE FROM ${CONVERSATION};
      DELETE FROM ${NODE};
      DELETE FROM ${LINK};
    `);
    console.log('Deleted all data');
  } catch (error) {
    console.error('Error deleting data: ', error);
  }
}

// return all instances of a table
export const getAll = async (db, table) => {
  const instances = []
  const results = await db.getAllAsync(`
      SELECT * FROM ${table}`
  );
  results?.forEach((row) => {
    instances.push(row)
  })
  return instances
}

// count all instances of a table
export const count = async (db, table) => {
  const result = await db.getAllAsync(
    `SELECT COUNT(*) as count FROM ${table}`
  );
  return result[0].count
}

// generate conversation, nodes and links from an object
// { 
//   id: '3', 
//   name: 'Conversation 3', 
//   data: { 
//     nodes: [
//       { id: '1', name: 'Node A3' }, 
//       { id: '2', name: 'Node B3' },
//       { id: '3', name: 'Node C3' },
//       { id: '4', name: 'Node D3' } 
//     ], 
//     links: [
//       { source: '1', target: '2' },
//       { source: '2', target: '3' },
//     ] 
//   } 
// }
export const createGraph = async (db, graph) => {
  const conversationId = await insertConversation(db, graph.name);
  // console.log('conversationId', conversationId);
  if (!conversationId) {
    throw new Error('Failed to insert conversation');
  }

  const nodeMap = {};

  for (const node of graph.data.nodes) {
    const nodeId = await insertNode(db, conversationId, node.name);
    if (nodeId) {
      nodeMap[node.id] = nodeId;
    } else {
      throw new Error('Failed to insert node');
    }
  }

  for (const link of graph.data.links) {
    const sourceNodeId = nodeMap[link.source];
    const targetNodeId = nodeMap[link.target];
    await insertLink(db, conversationId, sourceNodeId, targetNodeId);
  }

  console.log('Graph created successfully');
  return conversationId;
}


// return conversation, nodes and links from a conversation id
export const getGraph = async (db, conversationId) => {
  const conversation = await db.getFirstAsync(`
      SELECT * FROM ${CONVERSATION} WHERE id = $conversationId`, { $conversationId: conversationId }
  );

  if (!conversation) {
    console.log('Conversation not found');
    return null;
  }

  const nodes = await db.getAllAsync(`
      SELECT * FROM ${NODE} WHERE graphId = $conversationId`, { $conversationId: conversationId }
  );

  const links = await db.getAllAsync(`
      SELECT * FROM ${LINK} WHERE graphId = $conversationId`, { $conversationId: conversationId }
  );

  return {
    id: conversation.id,
    name: conversation.name,
    data: {
      nodes: nodes,
      links: links
    }
  };
}

export const getAllGraphs = async (db) => {
  const conversations = await getAll(db, CONVERSATION);
  const graphs = [];
  for (const conversation of conversations) {
    const graph = await getGraph(db, conversation.id);
    graphs.push(graph);
  }
  return graphs;
}
