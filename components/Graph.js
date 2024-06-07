// Graph.js
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const Graph = ({ graph }) => {
  const [d3Graph, setD3Graph] = useState({ nodes: [], links: [] });
  const simulationRef = useRef(null);
  const { width, height } = Dimensions.get('window');

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const minScale = 0.5;
  const maxScale = 4;

  useEffect(() => {
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.links).id((d) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(0, 0))
        .force('collide', d3.forceCollide(20))
        .on('tick', () => {
          setD3Graph({
            nodes: [...simulationRef.current.nodes()],
            links: [...simulationRef.current.force('link').links()],
          });
        });
    } else {
      simulationRef.current.nodes(graph.nodes);
      simulationRef.current.force('link').links(graph.links);
      simulationRef.current.alpha(0.3).restart();
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graph]);

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(maxScale, Math.max(minScale, savedScale.value * event.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  });

  const calculateViewBoxDimensions = () => {
    if (d3Graph.nodes.length === 0) return { minX: 0, minY: 0, viewBoxWidth: width, viewBoxHeight: height };

    const padding = 50;
    const minX = Math.min(...d3Graph.nodes.map((node) => node.x)) - padding;
    const minY = Math.min(...d3Graph.nodes.map((node) => node.y)) - padding;
    const maxX = Math.max(...d3Graph.nodes.map((node) => node.x)) + padding;
    const maxY = Math.max(...d3Graph.nodes.map((node) => node.y)) + padding;
    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;

    return { minX, minY, viewBoxWidth, viewBoxHeight };
  };

  const calculateViewBox = () => {
    const { minX, minY, viewBoxWidth, viewBoxHeight } = calculateViewBoxDimensions();
    return `${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`;
  };

  return (
    <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Svg width={width} height={height} viewBox={calculateViewBox()}>
          {d3Graph.links.map((link, index) => (
            <Line
              key={index}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              stroke="#999"
            />
          ))}
          {d3Graph.nodes.map((node, index) => (
            <Circle
              key={index}
              cx={node.x}
              cy={node.y}
              r={10}
              fill="#69b3a2"
              onPress={() => alert(`Node ${node.name} pressed`)}
            />
          ))}
          {d3Graph.nodes.map((node, index) => (
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
  );
};

export default Graph;
