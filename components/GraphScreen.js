// GraphScreen.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Graph from './Graph';
import FloatingActionMenu from './FloatingActionMenu';
import CustomModal from './CustomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSQLiteContext } from 'expo-sqlite';
import { getGraph } from '../database/CRUD';

const GraphScreen = ({ route }) => {
  const { conversationId } = route.params;
  const db = useSQLiteContext();
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [newNodeName, setNewNodeName] = useState('');
  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const graphData = await getGraph(db, conversationId);
        console.log('Graph data fetched', graphData);
        // Map the nodes and links to the format expected by D3
        const nodes = graphData.data.nodes.map(node => ({ id: node.id, name: node.name }));
        const links = graphData.data.links.map(link => ({
          source: link.sourceNodeId,
          target: link.targetNodeId
        }));
        setGraph({ nodes, links });
        console.log('Graph data fetched', graph);
      } catch (error) {
        console.error('Failed to fetch graph data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [db, conversationId]);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewNodeName('');
    setNewLinkSource('');
    setNewLinkTarget('');
  };

  const addNode = () => {
    if (newNodeName.trim() !== '') {
      const newNodeId = (graph.nodes.length + 1).toString();
      setGraph(prevGraph => ({
        ...prevGraph,
        nodes: [...prevGraph.nodes, { id: newNodeId, name: newNodeName.trim() }]
      }));
      closeModal();
    }
  };

  const addLink = () => {
    if (newLinkSource !== '' && newLinkTarget !== '') {
      setGraph(prevGraph => ({
        ...prevGraph,
        links: [...prevGraph.links, { source: newLinkSource, target: newLinkTarget }]
      }));
      closeModal();
    }
  };

  const sortedNodes = [...graph.nodes].sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Graph graph={graph} />

        <CustomModal
          visible={modalVisible}
          modalType={modalType}
          newNodeName={newNodeName}
          setNewNodeName={setNewNodeName}
          newLinkSource={newLinkSource}
          setNewLinkSource={setNewLinkSource}
          newLinkTarget={newLinkTarget}
          setNewLinkTarget={setNewLinkTarget}
          sortedNodes={sortedNodes}
          onAddNode={addNode}
          onAddLink={addLink}
          onClose={closeModal}
        />

        <FloatingActionMenu
          onNewTopicPress={() => openModal('newTopic')}
          onAddLinkPress={() => openModal('addLink')}
        />
      </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default GraphScreen;
