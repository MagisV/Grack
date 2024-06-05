import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

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

  const minScale = 0.5;
  const maxScale = 4;

  useEffect(() => {
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(0, 0))
        .force('collide', d3.forceCollide(20))
        .on('tick', () => {
          setGraph({
            nodes: [...simulationRef.current.nodes()],
            links: [...simulationRef.current.force('link').links()],
          });
        });
    } else {
      simulationRef.current.nodes(data.nodes);
      simulationRef.current.force('link').links(data.links);
      simulationRef.current.alpha(0.3).restart();
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data]);

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
      const newScale = Math.min(maxScale, Math.max(minScale, lastScale.value * event.scale));
      const scaleChange = newScale / lastScale.value;

      const focalX = event.focalX - width / 2;
      const focalY = event.focalY - height / 2;

      const newTranslateX = focalX - scaleChange * (focalX - lastTranslateX.value);
      const newTranslateY = focalY - scaleChange * (focalY - lastTranslateY.value);

      translateX.value = newTranslateX;
      translateY.value = newTranslateY;
      scale.value = newScale;

      console.log('Pinch Update:', { newScale, newTranslateX, newTranslateY });
    })
    .onEnd(() => {
      // Store the final values from the gesture updates
      lastScale.value = scale.value;
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;

      console.log('Pinch End:', { lastScale: lastScale.value, lastTranslateX: lastTranslateX.value, lastTranslateY: lastTranslateY.value });
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

  const calculateViewBox = () => {
    if (graph.nodes.length === 0) return `0 0 ${width} ${height}`;

    const padding = 50;
    const minX = Math.min(...graph.nodes.map(node => node.x)) - padding;
    const minY = Math.min(...graph.nodes.map(node => node.y)) - padding;
    const maxX = Math.max(...graph.nodes.map(node => node.x)) + padding;
    const maxY = Math.max(...graph.nodes.map(node => node.y)) + padding;
    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;

    return `${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <Svg
            width={width}
            height={height}
            viewBox={calculateViewBox()}
          >
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
                onPress={() => alert(`Node ${node.name} pressed`)}
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
                {node.name}
              </SvgText>
            ))}
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Graph;


// import React, { useEffect, useState, useRef } from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import * as d3 from 'd3';
// import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// const Graph = ({ data }) => {
//   const [graph, setGraph] = useState({ nodes: [], links: [] });
//   const simulationRef = useRef(null);
//   const { width, height } = Dimensions.get('window');

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const lastTranslateX = useSharedValue(0);
//   const lastTranslateY = useSharedValue(0);
//   const lastScale = useSharedValue(1);

//   const finalFocalX = useSharedValue(0);
//   const finalFocalY = useSharedValue(0);

//   const minScale = 0.5;
//   const maxScale = 4;

//   useEffect(() => {
//     if (!simulationRef.current) {
//       simulationRef.current = d3.forceSimulation(data.nodes)
//         .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//         .force('charge', d3.forceManyBody().strength(-300))
//         .force('center', d3.forceCenter(0, 0))
//         .force('collide', d3.forceCollide(20))
//         .on('tick', () => {
//           setGraph({
//             nodes: [...simulationRef.current.nodes()],
//             links: [...simulationRef.current.force('link').links()],
//           });
//         });
//     } else {
//       simulationRef.current.nodes(data.nodes);
//       simulationRef.current.force('link').links(data.links);
//       simulationRef.current.alpha(0.3).restart();
//     }

//     return () => {
//       if (simulationRef.current) {
//         simulationRef.current.stop();
//       }
//     };
//   }, [data]);

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
//       const newScale = Math.min(maxScale, Math.max(minScale, lastScale.value * event.scale));
//       const scaleChange = newScale / lastScale.value;

//       const focalX = event.focalX - width / 2;
//       const focalY = event.focalY - height / 2;

//       const newTranslateX = focalX - scaleChange * (focalX - lastTranslateX.value);
//       const newTranslateY = focalY - scaleChange * (focalY - lastTranslateY.value);

//       translateX.value = newTranslateX;
//       translateY.value = newTranslateY;
//       scale.value = newScale;

//       // Store the final focal point values and translations
//       finalFocalX.value = focalX;
//       finalFocalY.value = focalY;

//       console.log('Pinch Update:', { newScale, newTranslateX, newTranslateY });
//     })
//     .onEnd(() => {
//       // Use the stored final values from the gesture updates
//       lastScale.value = scale.value;
//       lastTranslateX.value = translateX.value;
//       lastTranslateY.value = translateY.value;

//       console.log('Pinch End:', { lastScale: lastScale.value, lastTranslateX: lastTranslateX.value, lastTranslateY: lastTranslateY.value });
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

//   const calculateViewBox = () => {
//     if (graph.nodes.length === 0) return `0 0 ${width} ${height}`;

//     const padding = 50;
//     const minX = Math.min(...graph.nodes.map(node => node.x)) - padding;
//     const minY = Math.min(...graph.nodes.map(node => node.y)) - padding;
//     const maxX = Math.max(...graph.nodes.map(node => node.x)) + padding;
//     const maxY = Math.max(...graph.nodes.map(node => node.y)) + padding;
//     const viewBoxWidth = maxX - minX;
//     const viewBoxHeight = maxY - minY;

//     return `${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`;
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
//         <Animated.View style={[{ flex: 1 }, animatedStyle]}>
//           <Svg
//             width={width}
//             height={height}
//             viewBox={calculateViewBox()}
//           >
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
//                 onPress={() => alert(`Node ${node.name} pressed`)}
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
//                 {node.name}
//               </SvgText>
//             ))}
//           </Svg>
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default Graph;


// import React, { useEffect, useState, useRef } from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
// import * as d3 from 'd3';
// import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// const Graph = ({ data }) => {
//   const [graph, setGraph] = useState({ nodes: [], links: [] });
//   const simulationRef = useRef(null);
//   const { width, height } = Dimensions.get('window');

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const lastTranslateX = useSharedValue(0);
//   const lastTranslateY = useSharedValue(0);
//   const lastScale = useSharedValue(1);

//   const finalFocalX = useSharedValue(0);
//   const finalFocalY = useSharedValue(0);

//   const minScale = 0.5;
//   const maxScale = 4;

//   useEffect(() => {
//     if (!simulationRef.current) {
//       simulationRef.current = d3.forceSimulation(data.nodes)
//         .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
//         .force('charge', d3.forceManyBody().strength(-300))
//         .force('center', d3.forceCenter(0, 0))
//         .force('collide', d3.forceCollide(20))
//         .on('tick', () => {
//           setGraph({
//             nodes: [...simulationRef.current.nodes()],
//             links: [...simulationRef.current.force('link').links()],
//           });
//         });
//     } else {
//       simulationRef.current.nodes(data.nodes);
//       simulationRef.current.force('link').links(data.links);
//       simulationRef.current.alpha(0.3).restart();
//     }

//     return () => {
//       if (simulationRef.current) {
//         simulationRef.current.stop();
//       }
//     };
//   }, [data]);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = lastTranslateX.value + event.translationX;
//       translateY.value = lastTranslateY.value + event.translationY;
//     })
//     .onEnd(() => {
//       lastTranslateX.value = translateX.value;
//       lastTranslateY.value = translateY.value;
//     });


//     const pinchGesture = Gesture.Pinch()
//     .onUpdate((event) => {
//       const newScale = Math.min(maxScale, Math.max(minScale, lastScale.value * event.scale));
//       const scaleChange = newScale / lastScale.value;

//       const focalX = event.focalX - width / 2;
//       const focalY = event.focalY - height / 2;

//       const newTranslateX = focalX - scaleChange * (focalX - lastTranslateX.value);
//       const newTranslateY = focalY - scaleChange * (focalY - lastTranslateY.value);

//       translateX.value = newTranslateX;
//       translateY.value = newTranslateY;
//       scale.value = newScale;

//       // Store the final focal point values
//       finalFocalX.value = focalX;
//       finalFocalY.value = focalY;
//       console.log('on update event', event)
//       console.log('Pinch Update:', { newScale, newTranslateX, newTranslateY });
//     })
//     .onEnd((event) => {
//       // Use the stored final focal point values to compute the correct last values

//       // Use the final values from the gesture updates
//     //   lastScale.value = scale.value;
//     //   lastTranslateX.value = translateX.value;
//     //   lastTranslateY.value = translateY.value;
//       const newScale = Math.min(maxScale, Math.max(minScale, lastScale.value * event.scale));
//       const scaleChange = newScale / lastScale.value;

//       const newTranslateX = finalFocalX.value - scaleChange * (finalFocalX.value - lastTranslateX.value);
//       const newTranslateY = finalFocalY.value - scaleChange * (finalFocalY.value - lastTranslateY.value);

//       lastScale.value = scale.value;
//       lastTranslateX.value = newTranslateX;
//       lastTranslateY.value = newTranslateY;
//       console.log('on end event', event)

//       console.log('Pinch End:', { lastScale: lastScale.value, lastTranslateX: lastTranslateX.value, lastTranslateY: lastTranslateY.value });
//     });

//     // const pinchGesture = Gesture.Pinch()
//     // .onUpdate((event) => {
//     //   const newScale = Math.min(maxScale, Math.max(minScale, lastScale.value * event.scale));
//     //   const scaleChange = newScale / lastScale.value;
  
//     //   const focalX = event.focalX - width / 2;
//     //   const focalY = event.focalY - height / 2;
  
//     //   const newTranslateX = focalX - scaleChange * (focalX - lastTranslateX.value);
//     //   const newTranslateY = focalY - scaleChange * (focalY - lastTranslateY.value);
  
//     //   translateX.value = newTranslateX;
//     //   translateY.value = newTranslateY;
//     //   scale.value = newScale;
//     //   console.log('on update event', event)
//     //   console.log('Pinch Update:', { newScale, newTranslateX, newTranslateY });
//     // })
//     // .onEnd((event) => {
//     //   lastScale.value = scale.value;
//     //   lastTranslateX.value = translateX.value;
//     //   lastTranslateY.value = translateY.value;
//     //   console.log('on end event', event)
//     //   console.log('Pinch End:', { lastScale: lastScale.value, lastTranslateX: lastTranslateX.value, lastTranslateY: lastTranslateY.value });
//     // });
  

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translateX.value },
//         { translateY: translateY.value },
//         { scale: scale.value },
//       ],
//     };
//   });

//   const calculateViewBox = () => {
//     if (graph.nodes.length === 0) return `0 0 ${width} ${height}`;

//     const padding = 50;
//     const minX = Math.min(...graph.nodes.map(node => node.x)) - padding;
//     const minY = Math.min(...graph.nodes.map(node => node.y)) - padding;
//     const maxX = Math.max(...graph.nodes.map(node => node.x)) + padding;
//     const maxY = Math.max(...graph.nodes.map(node => node.y)) + padding;
//     const viewBoxWidth = maxX - minX;
//     const viewBoxHeight = maxY - minY;

//     return `${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`;
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
//         <Animated.View style={[{ flex: 1 }, animatedStyle]}>
//           <Svg
//             width={width}
//             height={height}
//             viewBox={calculateViewBox()}
//           >
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
//                 onPress={() => alert(`Node ${node.name} pressed`)}
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
//                 {node.name}
//               </SvgText>
//             ))}
//           </Svg>
//         </Animated.View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// };

// export default Graph;