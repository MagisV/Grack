import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Modal, Button as NativeButton } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Graph from './components/Graph8';
import FloatingActionMenu from './components/FloatingActionMenu';

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
      <SafeAreaView style={styles.container}>
        <Graph data={data} />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {modalType === 'newTopic' ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="New Node"
                    value={newNodeName}
                    onChangeText={setNewNodeName}
                  />
                  <Button mode="contained" onPress={addNode}>Add Node</Button>
                </>
              ) : (
                <>
                  <Picker
                    selectedValue={newLinkSource}
                    style={styles.picker}
                    onValueChange={(itemValue) => setNewLinkSource(itemValue)}
                  >
                    <Picker.Item label="Select Source Node" value="" />
                    {sortedNodes.map((node) => (
                      <Picker.Item key={node.id} label={node.name} value={node.id} />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={newLinkTarget}
                    style={styles.picker}
                    onValueChange={(itemValue) => setNewLinkTarget(itemValue)}
                  >
                    <Picker.Item label="Select Target Node" value="" />
                    {sortedNodes.map((node) => (
                      <Picker.Item key={node.id} label={node.name} value={node.id} />
                    ))}
                  </Picker>

                  <Button mode="contained" onPress={addLink}>Add Link</Button>
                </>
              )}
              <NativeButton title="Cancel" onPress={closeModal} />
            </View>
          </View>
        </Modal>

        <FloatingActionMenu
          onNewTopicPress={() => openModal('newTopic')}
          onAddLinkPress={() => openModal('addLink')}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default App;




// import React, { useState } from 'react';
// import { SafeAreaView, StyleSheet, TextInput, Button, View } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Graph from './components/Graph8';

// const initialData = {
//   nodes: [
//     { id: '1', name: 'Node 1' },
//     { id: '2', name: 'Node 2' },
//     { id: '3', name: 'Node 3' },
//     { id: '4', name: 'Node 4' },
//   ],
//   links: [
//     { source: '1', target: '2' },
//     { source: '2', target: '3' },
//   ],
// };

// const App = () => {
//   const [data, setData] = useState(initialData);
//   const [newNodeName, setNewNodeName] = useState('');
//   const [newLinkSource, setNewLinkSource] = useState('');
//   const [newLinkTarget, setNewLinkTarget] = useState('');

//   const addNode = () => {
//     if (newNodeName.trim() !== '') {
//       const newNodeId = (data.nodes.length + 1).toString();
//       setData(prevData => ({
//         ...prevData,
//         nodes: [...prevData.nodes, { id: newNodeId, name: newNodeName.trim() }]
//       }));
//       setNewNodeName('');
//     }
//   };

//   const addLink = () => {
//     if (newLinkSource !== '' && newLinkTarget !== '') {
//       setData(prevData => ({
//         ...prevData,
//         links: [...prevData.links, { source: newLinkSource, target: newLinkTarget }]
//       }));
//       setNewLinkSource('');
//       setNewLinkTarget('');
//     }
//   };

//   const sortedNodes = [...data.nodes].sort((a, b) => a.name.localeCompare(b.name));

//   return (
//     <SafeAreaView style={styles.container}>
//       <Graph data={data} />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="New Node"
//           value={newNodeName}
//           onChangeText={setNewNodeName}
//         />
//         <Button title="Add Node" onPress={addNode} />
        
//         <Picker
//           selectedValue={newLinkSource}
//           style={styles.picker}
//           onValueChange={(itemValue) => setNewLinkSource(itemValue)}
//         >
//           <Picker.Item label="Select Source Node" value="" />
//           {sortedNodes.map((node) => (
//             <Picker.Item key={node.id} label={node.name} value={node.id} />
//           ))}
//         </Picker>
        
//         <Picker
//           selectedValue={newLinkTarget}
//           style={styles.picker}
//           onValueChange={(itemValue) => setNewLinkTarget(itemValue)}
//         >
//           <Picker.Item label="Select Target Node" value="" />
//           {sortedNodes.map((node) => (
//             <Picker.Item key={node.id} label={node.name} value={node.id} />
//           ))}
//         </Picker>
        
//         <Button title="Add Link" onPress={addLink} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 10,
//   },
// });

// export default App;

// // App.js
// import React, { useState } from 'react';
// import { SafeAreaView, StyleSheet, TextInput, Button, View} from 'react-native';
// import Graph from './components/Graph4';
// import { Picker } from '@react-native-picker/picker';


// const initialData = {
//   nodes: [
//     { id: '1', name: 'Node 1' },
//     { id: '2', name: 'Node 2' },
//     { id: '3', name: 'Node 3' },
//     { id: '4', name: 'Node 4' },
//   ],
//   links: [
//     { source: '1', target: '2' },
//     { source: '2', target: '3' },
//   ],
// };

// const App = () => {
//   const [data, setData] = useState(initialData);
//   const [newNodeName, setNewNodeName] = useState('');
//   const [newLinkSource, setNewLinkSource] = useState('');
//   const [newLinkTarget, setNewLinkTarget] = useState('');

//   const addNode = () => {
//     if (newNodeName.trim() !== '') {
//       const newNodeId = (data.nodes.length + 1).toString();
//       setData(prevData => ({
//         ...prevData,
//         nodes: [...prevData.nodes, { id: newNodeId, name: newNodeName.trim() }]
//       }));
//       setNewNodeName('');
//     }
//   };

//   const addLink = () => {
//     if (newLinkSource.trim() !== '' && newLinkTarget.trim() !== '') {
//       setData(prevData => ({
//         ...prevData,
//         links: [...prevData.links, { source: newLinkSource.trim(), target: newLinkTarget.trim() }]
//       }));
//       setNewLinkSource('');
//       setNewLinkTarget('');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Graph data={data} />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="New Node ID"
//           value={newNodeName}
//           onChangeText={setNewNodeName}
//         />
//         <Button title="Add Node" onPress={addNode} />
//         <TextInput
//           style={styles.input}
//           placeholder="Link Source ID"
//           value={newLinkSource}
//           onChangeText={setNewLinkSource}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Link Target ID"
//           value={newLinkTarget}
//           onChangeText={setNewLinkTarget}
//         />
//         <Button title="Add Link" onPress={addLink} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginRight: 10,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default App;



// // App.js
// import React, { useState } from 'react';
// import { SafeAreaView, StyleSheet, TextInput, Button, View } from 'react-native';
// import Graph from './components/Graph3';

// const initialData = {
//   nodes: [
//     { id: '1' },
//     { id: '2' },
//     { id: '3' },
//     { id: '4' },
//   ],
//   links: [
//     { source: '1', target: '2' },
//     { source: '2', target: '3' },
//   ],
// };

// const App = () => {
//   const [data, setData] = useState(initialData);
//   const [newNode, setNewNode] = useState('');
//   const [newLinkSource, setNewLinkSource] = useState('');
//   const [newLinkTarget, setNewLinkTarget] = useState('');

//   const addNode = () => {
//     if (newNode.trim() !== '') {
//       setData(prevData => ({
//         ...prevData,
//         nodes: [...prevData.nodes, { id: newNode.trim() }]
//       }));
//       setNewNode('');
//     }
//   };

//   const addLink = () => {
//     if (newLinkSource.trim() !== '' && newLinkTarget.trim() !== '') {
//       setData(prevData => ({
//         ...prevData,
//         links: [...prevData.links, { source: newLinkSource.trim(), target: newLinkTarget.trim() }]
//       }));
//       setNewLinkSource('');
//       setNewLinkTarget('');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Graph data={data} />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="New Node ID"
//           value={newNode}
//           onChangeText={setNewNode}
//         />
//         <Button title="Add Node" onPress={addNode} />
//         <TextInput
//           style={styles.input}
//           placeholder="Link Source ID"
//           value={newLinkSource}
//           onChangeText={setNewLinkSource}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Link Target ID"
//           value={newLinkTarget}
//           onChangeText={setNewLinkTarget}
//         />
//         <Button title="Add Link" onPress={addLink} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginRight: 10,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default App;
