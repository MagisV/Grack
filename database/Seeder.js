import * as SQLite from 'expo-sqlite';
import { insertConversation, insertLink, insertNode, deleteAll, count, getAll, createGraph, getGraph, getAllGraphs } from './CRUD';
import { CONVERSATION, LINK, NODE } from '../constants';

const conversations = [
    { id: '1', name: 'Conversation 1', data: { nodes: [{ id: '1', name: 'Node A1' }, { id: '2', name: 'Node B1' }], links: [{ source: '1', target: '2' }] } },
    { id: '2', name: 'Conversation 2', data: { nodes: [{ id: '1', name: 'Node A2' }, { id: '2', name: 'Node B2' }], links: [{ source: '1', target: '2' }] } },
    { 
      id: '3', 
      name: 'Conversation 3', 
      data: { 
        nodes: [
          { id: '1', name: 'Node A3' }, 
          { id: '2', name: 'Node B3' },
          { id: '3', name: 'Node C3' },
          { id: '4', name: 'Node D3' } 
        ], 
        links: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
        ] 
      } 
    }
  ];

const printGraph = (graph) => {
    console.log('-------------------')
    console.log(`Graph: ID: ${graph.id}, Name: ${graph.name}`);
    console.log('Nodes: ', graph.data.nodes);
    console.log('Links: ', graph.data.links);
    console.log('-------------------')
}

const isDatabaseEmpty = async (db) => {
    const countConversations = await count(db, CONVERSATION);
    console.log('Count conversations: ', countConversations);
    if (countConversations > 0) {
        return false;
    }
    return true;
}

export const seedDatabase = async (db) => {
    if (await isDatabaseEmpty(db)) {
        console.log('Seeding database');
        const ids = []
        for (const graph of conversations) {
            const id = await createGraph(db, graph);
            ids.push(id);
        }
        for (const id of ids) {
            const retrievedGraph = await getGraph(db, id);
            printGraph(retrievedGraph);
        }
    } else {
        console.log('Database already seeded');

        const graphs = await getAllGraphs(db);
        graphs.forEach(graph => printGraph(graph));
    }
}