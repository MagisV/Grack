// Graph.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const Graph = ({ data }) => {
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const simulationRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const lastScale = useSharedValue(1);

  useEffect(() => {
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    // Custom force to keep nodes within bounds
    const forceBoundingBox = () => {
      for (const node of data.nodes) {
        node.x = clamp(node.x, 20, width - 20);
        node.y = clamp(node.y, 20, height - 20);
      }
    };

    // Initialize the simulation if it doesn't exist
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(20))
        .on('tick', () => {
          forceBoundingBox();
          setGraph({
            nodes: [...simulationRef.current.nodes()],
            links: [...simulationRef.current.force('link').links()],
          });
        });
    } else {
      // Update the simulation with new nodes and links
      simulationRef.current.nodes(data.nodes);
      simulationRef.current.force('link').links(data.links);
      simulationRef.current.alpha(0.3).restart(); // Adjust the alpha for a smooth transition
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data, width, height]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = lastTranslateX.value + event.translationX;
      translateY.value = lastTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = lastScale.value * event.scale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <Svg width={width} height={height}>
            {graph.links.map((link, index) => (
              <Line
                key={index}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke="#999"
              />
            ))}
            {graph.nodes.map((node, index) => (
              <Circle
                key={index}
                cx={node.x}
                cy={node.y}
                r={10}
                fill="#69b3a2"
                onPress={() => alert(`Node ${node.id} pressed`)}
              />
            ))}
            {graph.nodes.map((node, index) => (
              <SvgText
                key={index}
                x={node.x}
                y={node.y}
                fontSize="10"
                fill="#333"
                textAnchor="middle"
                dy={-15}
              >
                {node.id}
              </SvgText>
            ))}
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Graph;


// // Graph.js
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import * as d3 from 'd3';
// import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// const Graph = ({ data }) => {
//   const [graph, setGraph] = useState({ nodes: [], links: [] });
//   const { width, height } = Dimensions.get('window');
//   const simulationRef = useRef(null);

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const lastTranslateX = useSharedValue(0);
//   const lastTranslateY = useSharedValue(0);
//   const lastScale = useSharedValue(1);

//   useEffect(() => {
//     const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

//     // Custom force to keep nodes within bounds
//     const forceBoundingBox = () => {
//       for (const node of data.nodes) {
//         node.x = clamp(node.x, 20, width - 20);
//         node.y = clamp(node.y, 20, height - 20);
//       }
//     };

//      // Initialize the simulation if it doesn't exist
//      if (!simulationRef.current) {
//         simulationRef.current = d3.forceSimulation(data.nodes)
//           .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//           .force('charge', d3.forceManyBody().strength(-300))
//           .force('center', d3.forceCenter(width / 2, height / 2))
//           .force('collide', d3.forceCollide(20))
//           .on('tick', () => {
//             forceBoundingBox();
//             setGraph({
//               nodes: [...simulationRef.current.nodes()],
//               links: [...simulationRef.current.force('link').links()],
//             });
//           });
//       } else {
//         // Update the simulation with new nodes and links
//         simulationRef.current.nodes(data.nodes);
//         simulationRef.current.force('link').links(data.links);
//         simulationRef.current.alpha(0.3).restart(); // Adjust the alpha for a smooth transition
//       }
  
//       return () => {
//         if (simulationRef.current) {
//           simulationRef.current.stop();
//         }
//       };
//     }, [data, width, height]);

// //     // Use d3 to create the graph layout
// //     const simulation = d3.forceSimulation(data.nodes)
// //       .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
// //       .force('charge', d3.forceManyBody().strength(-300))
// //       .force('center', d3.forceCenter(width / 2, height / 2))
// //       .force('collide', d3.forceCollide(20))
// //       .on('tick', () => {
// //         forceBoundingBox();
// //         setGraph({
// //           nodes: [...simulation.nodes()],
// //           links: [...simulation.force('link').links()],
// //         });
// //       });

// //     return () => {
// //       simulation.stop();
// //     };
// //   }, [data, width, height]);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = lastTranslateX.value + event.translationX;
//       translateY.value = lastTranslateY.value + event.translationY;
//     })
//     .onEnd(() => {
//       lastTranslateX.value = translateX.value;
//       lastTranslateY.value = translateY.value;
//     });

//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       scale.value = lastScale.value * event.scale;
//     })
//     .onEnd(() => {
//       lastScale.value = scale.value;
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//         { scale: scale.value },
//       ],
//     };
//   });

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
//         <Animated.View style={[{ flex: 1 }, animatedStyle]}>
//           <Svg width={width} height={height}>
//             {graph.links.map((link, index) => (
//               <Line
//                 key={index}
//                 x1={link.source.x}
//                 y1={link.source.y}
//                 x2={link.target.x}
//                 y2={link.target.y}
//                 stroke="#999"
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <Circle
//                 key={index}
//                 cx={node.x}
//                 cy={node.y}
//                 r={10}
//                 fill="#69b3a2"
//                 onPress={() => alert(`Node ${node.id} pressed`)}
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <SvgText
//                 key={index}
//                 x={node.x}
//                 y={node.y}
//                 fontSize="10"
//                 fill="#333"
//                 textAnchor="middle"
//                 dy={-15}
//               >
//                 {node.id}
//               </SvgText>
//             ))}
//           </Svg>
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default Graph;



// // Graph.js
// import React, { useEffect, useState } from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import * as d3 from 'd3';
// import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// const Graph = ({ data }) => {
//   const [graph, setGraph] = useState({ nodes: [], links: [] });
//   const { width, height } = Dimensions.get('window');
  
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const lastTranslateX = useSharedValue(0);
//   const lastTranslateY = useSharedValue(0);
//   const lastScale = useSharedValue(1);

//   useEffect(() => {
//     // Use d3 to create the graph layout
//      const simulation = d3.forceSimulation(data.nodes)
//       .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//       .force('charge', d3.forceManyBody().strength((d) => (data.links.length === 0 ? 0 : -300)))
//       .force('center', d3.forceCenter(width / 2, height / 2))
//       .force('collide', d3.forceCollide(20))
//       .on('tick', () => {
//         setGraph({
//           nodes: [...simulation.nodes()],
//           links: [...simulation.force('link').links()],
//         });
//       });
//     // const simulation = d3.forceSimulation(data.nodes)
//     //   .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//     //   .force('charge', d3.forceManyBody().strength(-300))
//     //   .force('center', d3.forceCenter(width / 2, height / 2))
//     //   .on('tick', () => {
//     //     setGraph({
//     //       nodes: [...simulation.nodes()],
//     //       links: [...simulation.force('link').links()],
//     //     });
//     //   });

//     return () => {
//       simulation.stop();
//     };
//   }, [data, width, height]);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = lastTranslateX.value + event.translationX;
//       translateY.value = lastTranslateY.value + event.translationY;
//     })
//     .onEnd(() => {
//       lastTranslateX.value = translateX.value;
//       lastTranslateY.value = translateY.value;
//     });

//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       scale.value = lastScale.value * event.scale;
//     })
//     .onEnd(() => {
//       lastScale.value = scale.value;
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//         { scale: scale.value },
//       ],
//     };
//   });

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
//         <Animated.View style={[{ flex: 1 }, animatedStyle]}>
//           <Svg width={width} height={height}>
//             {graph.links.map((link, index) => (
//               <Line
//                 key={index}
//                 x1={link.source.x}
//                 y1={link.source.y}
//                 x2={link.target.x}
//                 y2={link.target.y}
//                 stroke="#999"
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <Circle
//                 key={index}
//                 cx={node.x}
//                 cy={node.y}
//                 r={10}
//                 fill="#69b3a2"
//                 onPress={() => alert(`Node ${node.id} pressed`)}
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <SvgText
//                 key={index}
//                 x={node.x}
//                 y={node.y}
//                 fontSize="10"
//                 fill="#333"
//                 textAnchor="middle"
//                 dy={-15}
//               >
//                 {node.id}
//               </SvgText>
//             ))}
//           </Svg>
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default Graph;



// import React, { useEffect, useState } from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import * as d3 from 'd3';
// import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// const Graph = ({ data }) => {
//   const [graph, setGraph] = useState({ nodes: [], links: [] });
//   const { width, height } = Dimensions.get('window');
  
//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);

//   useEffect(() => {
//     // Use d3 to create the graph layout
//     const simulation = d3.forceSimulation(data.nodes)
//       .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//       .force('charge', d3.forceManyBody().strength(-300))
//       .force('center', d3.forceCenter(width / 2, height / 2))
//       .on('tick', () => {
//         setGraph({
//           nodes: [...simulation.nodes()],
//           links: [...simulation.force('link').links()],
//         });
//       });

//     return () => {
//       simulation.stop();
//     };
//   }, [data, width, height]);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = event.translationX;
//       translateY.value = event.translationY;
//     })
//     .onEnd(() => {
//       translateX.value = withSpring(0);
//       translateY.value = withSpring(0);
//     });

//   const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       scale.value = event.scale;
//     })
//     .onEnd(() => {
//       scale.value = withSpring(1);
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//         { scale: scale.value },
//       ],
//     };
//   });

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
//         <Animated.View style={[{ flex: 1 }, animatedStyle]}>
//           <Svg width={width} height={height}>
//             {graph.links.map((link, index) => (
//               <Line
//                 key={index}
//                 x1={link.source.x}
//                 y1={link.source.y}
//                 x2={link.target.x}
//                 y2={link.target.y}
//                 stroke="#999"
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <Circle
//                 key={index}
//                 cx={node.x}
//                 cy={node.y}
//                 r={10}
//                 fill="#69b3a2"
//                 onPress={() => alert(`Node ${node.id} pressed`)}
//               />
//             ))}
//             {graph.nodes.map((node, index) => (
//               <SvgText
//                 key={index}
//                 x={node.x}
//                 y={node.y}
//                 fontSize="10"
//                 fill="#333"
//                 textAnchor="middle"
//                 dy={-15}
//               >
//                 {node.id}
//               </SvgText>
//             ))}
//           </Svg>
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default Graph;

