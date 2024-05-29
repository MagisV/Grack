// App.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Graph from './components/GraphWithGestures1';

const data = {
  nodes: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },


  ],
};

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Graph data={data} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;




// import React, { useState, useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View, Button, TextInput } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

// export default function App() {
//   const [nodes, setNodes] = useState([
//     { id: 'A' },
//     { id: 'B' },
//     { id: 'C' },
//   ]);
//   const [links, setLinks] = useState([
//     { source: 'A', target: 'B' },
//     { source: 'B', target: 'C' },
//     { source: 'C', target: 'A' },
//   ]);
//   const [newNodeId, setNewNodeId] = useState('');
//   const [newLinkSource, setNewLinkSource] = useState('');
//   const [newLinkTarget, setNewLinkTarget] = useState('');

//   useEffect(() => {
//     const simulation = forceSimulation(nodes)
//       .force('link', forceLink(links).id(d => d.id).distance(100))
//       .force('charge', forceManyBody().strength(-200))
//       .force('center', forceCenter(200, 200))
//       .on('tick', () => {
//         // Update node positions after each tick
//         setNodes([...nodes]);
//       });

//     // Run the simulation to update node positions
//     for (let i = 0; i < 100; i++) simulation.tick();

//     // Clean up simulation on component unmount
//     return () => simulation.stop();
//   }, [nodes, links]);

//   const handleAddNode = () => {
//     if (newNodeId) {
//       setNodes([...nodes, { id: newNodeId }]);
//       setNewNodeId('');
//     }
//   };

//   const handleAddLink = () => {
//     if (newLinkSource && newLinkTarget) {
//       setLinks([...links, { source: newLinkSource, target: newLinkTarget }]);
//       setNewLinkSource('');
//       setNewLinkTarget('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Svg height="400" width="400">
//         {links.map((link, index) => {
//           const sourceNode = nodes.find(n => n.id === link.source.id || n.id === link.source);
//           const targetNode = nodes.find(n => n.id === link.target.id || n.id === link.target);

//           if (!sourceNode || !targetNode) {
//             console.error(`Missing source or target node for link: ${link}`);
//             return null;
//           }

//           return (
//             <Line
//               key={index}
//               x1={sourceNode.x}
//               y1={sourceNode.y}
//               x2={targetNode.x}
//               y2={targetNode.y}
//               stroke="black"
//             />
//           );
//         })}
//         {nodes.map((node, index) => (
//           <Circle
//             key={index}
//             cx={node.x}
//             cy={node.y}
//             r={20}
//             fill="blue"
//           />
//         ))}
//         {nodes.map((node, index) => (
//           <SvgText
//             key={index}
//             x={node.x}
//             y={node.y}
//             fontSize="12"
//             fill="white"
//             textAnchor="middle"
//             dy=".3em"
//           >
//             {node.id}
//           </SvgText>
//         ))}
//       </Svg>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="New Node ID"
//           value={newNodeId}
//           onChangeText={setNewNodeId}
//         />
//         <Button title="Add Node" onPress={handleAddNode} />
//       </View>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Source Node ID"
//           value={newLinkSource}
//           onChangeText={setNewLinkSource}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Target Node ID"
//           value={newLinkTarget}
//           onChangeText={setNewLinkTarget}
//         />
//         <Button title="Add Link" onPress={handleAddLink} />
//       </View>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     margin: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 5,
//     marginRight: 5,
//     width: 100,
//   },
// });




// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

// const nodes = [
//   { id: 'A' },
//   { id: 'B' },
//   { id: 'C' },
// ];

// const links = [
//   { source: 'A', target: 'B' },
//   { source: 'B', target: 'C' },
//   { source: 'C', target: 'A' },
// ];

// export default function App() {
//   // Create a force simulation
//   const simulation = forceSimulation(nodes)
//     .force('link', forceLink(links).id(d => d.id).distance(100))
//     .force('charge', forceManyBody().strength(-200))
//     .force('center', forceCenter(200, 200))
//     .on('tick', () => {
//       // Update node positions after each tick
//       nodes.forEach(node => {
//         node.x = node.x || 200;
//         node.y = node.y || 200;
//       });
//     })
//     .stop();

//   // Run the simulation to update node positions
//   for (let i = 0; i < 100; i++) simulation.tick();

//   return (
//     <View style={styles.container}>
//       <Svg height="400" width="400">
//         {links.map((link, index) => {
//           const sourceNode = nodes.find(n => n.id === link.source.id || n.id === link.source);
//           const targetNode = nodes.find(n => n.id === link.target.id || n.id === link.target);

//           if (!sourceNode || !targetNode) {
//             console.error(`Missing source or target node for link: ${link}`);
//             return null;
//           }

//           return (
//             <Line
//               key={index}
//               x1={sourceNode.x}
//               y1={sourceNode.y}
//               x2={targetNode.x}
//               y2={targetNode.y}
//               stroke="black"
//             />
//           );
//         })}
//         {nodes.map((node, index) => (
//           <Circle
//             key={index}
//             cx={node.x}
//             cy={node.y}
//             r={20}
//             fill="blue"
//           />
//         ))}
//         {nodes.map((node, index) => (
//           <SvgText
//             key={index}
//             x={node.x}
//             y={node.y}
//             fontSize="12"
//             fill="white"
//             textAnchor="middle"
//             dy=".3em"
//           >
//             {node.id}
//           </SvgText>
//         ))}
//       </Svg>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
