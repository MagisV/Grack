// // ForceGraph.js
// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet } from 'react-native';
// import ForceGraph from 'react-force-graph';

// const Graph = ({ data }) => {
//   const graphRef = useRef(null);

//   useEffect(() => {
//     if (graphRef.current) {
//       // Reset the simulation when the initial data changes
//       graphRef.current.d3Force('charge').strength(-300); // Adjust the strength as needed
//       graphRef.current.d3ReheatSimulation();
//     }
//   }, [data.nodes.length, data.links.length]);

//   return (
//     <View style={{ flex: 1 }}>
//       <ForceGraph
//         ref={graphRef}
//         graphData={data}
//         nodeAutoColorBy="group"
//         linkDirectionalParticles={2}
//         linkDirectionalParticleSpeed={d => d.value * 0.001}
//       />
//     </View>
//   );
// };

// export default Graph;
