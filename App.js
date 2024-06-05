import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Graph from './components/Graph8';
import FloatingActionMenu from './components/FloatingActionMenu';
import CustomModal from './components/CustomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const initialData = {
  nodes: [
    { id: '1', name: 'Node 1' },
    { id: '2', name: 'Node 2' },
    { id: '3', name: 'Node 3' },
    { id: '4', name: 'Node 4' },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
  ],
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [newNodeName, setNewNodeName] = useState('');
  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

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
      const newNodeId = (data.nodes.length + 1).toString();
      setData(prevData => ({
        ...prevData,
        nodes: [...prevData.nodes, { id: newNodeId, name: newNodeName.trim() }]
      }));
      closeModal();
    }
  };

  const addLink = () => {
    if (newLinkSource !== '' && newLinkTarget !== '') {
      setData(prevData => ({
        ...prevData,
        links: [...prevData.links, { source: newLinkSource, target: newLinkTarget }]
      }));
      closeModal();
    }
  };

  const sortedNodes = [...data.nodes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Graph data={data} />

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

export default App;