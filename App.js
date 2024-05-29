// App.js
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, View} from 'react-native';
import Graph from './components/Graph4';

const initialData = {
  nodes: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    // { id: '5' },
    // { id: '6' },
    // { id: '7' },
    // { id: '8' },
    // { id: '9' },
    // { id: '10' },
    // { id: '11' },
    // { id: '12' },
    // { id: '13' },
    // { id: '14' },
    // { id: '15' },
    // { id: '16' },
    // { id: '17' },
    // { id: '18' },
    // { id: '19' },
    // { id: '20' },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    // { source: '3', target: '4' },
    // { source: '4', target: '5' },
    // { source: '5', target: '6' },
    // { source: '6', target: '8' },
    // { source: '7', target: '8' },
    // { source: '8', target: '10' },
    // { source: '9', target: '10' },
    // { source: '10', target: '11' },
    // { source: '11', target: '12' },

  ],
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [newNode, setNewNode] = useState('');
  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');

  const addNode = () => {
    if (newNode.trim() !== '') {
      setData(prevData => ({
        ...prevData,
        nodes: [...prevData.nodes, { id: newNode.trim() }]
      }));
      setNewNode('');
    }
  };

  const addLink = () => {
    if (newLinkSource.trim() !== '' && newLinkTarget.trim() !== '') {
      setData(prevData => ({
        ...prevData,
        links: [...prevData.links, { source: newLinkSource.trim(), target: newLinkTarget.trim() }]
      }));
      setNewLinkSource('');
      setNewLinkTarget('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Graph data={data} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Node ID"
          value={newNode}
          onChangeText={setNewNode}
        />
        <Button title="Add Node" onPress={addNode} />
        <TextInput
          style={styles.input}
          placeholder="Link Source ID"
          value={newLinkSource}
          onChangeText={setNewLinkSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Link Target ID"
          value={newLinkTarget}
          onChangeText={setNewLinkTarget}
        />
        <Button title="Add Link" onPress={addLink} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default App;



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
