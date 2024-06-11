// GraphScreen.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Graph from './Graph';
import FloatingActionMenu from './FloatingActionMenu';
import CustomModal from './CustomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSQLiteContext } from 'expo-sqlite';
import { getGraph, insertLink, insertNode } from '../database/CRUD';
import { startRecording, stopRecording } from './AudioRecorder';

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
  const [isRecording, setIsRecording] = useState(false);

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

  const addNode = async () => {
    if (newNodeName.trim() !== '') {
      try {
        const newNodeId = await insertNode(db, conversationId, newNodeName.trim());
        if (newNodeId) {
          setGraph(prevGraph => ({
            ...prevGraph,
            nodes: [...prevGraph.nodes, { id: newNodeId.toString(), name: newNodeName.trim() }]
          }));
        }
      } catch (error) {
        console.error('Failed to add node', error);
      } finally {
        closeModal();
      }
    }
  };

  const addLink = async () => {
    if (newLinkSource !== '' && newLinkTarget !== '') {
      try {
        const newLinkId = await insertLink(db, conversationId, newLinkSource, newLinkTarget);
        if (newLinkId) {
          setGraph(prevGraph => ({
            ...prevGraph,
            links: [...prevGraph.links, { source: newLinkSource, target: newLinkTarget }]
          }));
        }
      } catch (error) {
        console.error('Failed to add link', error);
      } finally {
        closeModal();
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // helper to log the state of isRecording
  useEffect(() => {console.log('isRecording:', isRecording);}, [isRecording]);

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
          onToggleRecordPress={toggleRecording}
          isRecording={isRecording}
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
