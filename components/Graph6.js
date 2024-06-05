import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

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
        .force('link', d3.forceLink(data.links).id((d) => d.id).distance(100))
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

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const xCurrent = useSharedValue(0);
  const yCurrent = useSharedValue(0);
  const scaleCurrent = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      if (event.numberOfPointers === 2) {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      }
    },
    onActive: (event) => {
      if (event.numberOfPointers === 2) {
        if (event.oldState === 2) {
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        }
        scaleCurrent.value = event.scale;

        xCurrent.value = (1 - scaleCurrent.value) * (focalX.value - width / 2);
        yCurrent.value = (1 - scaleCurrent.value) * (focalY.value - height / 2);
      }
    },
    onEnd: () => {
      lastScale.value *= scaleCurrent.value;

      lastTranslateX.value = scaleCurrent.value * lastTranslateX.value + xCurrent.value;
      lastTranslateY.value = scaleCurrent.value * lastTranslateY.value + yCurrent.value;

      xCurrent.value = 0;
      yCurrent.value = 0;
      scaleCurrent.value = 1;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: xCurrent.value },
        { translateY: yCurrent.value },
        { scale: scaleCurrent.value },
        { translateX: lastTranslateX.value },
        { translateY: lastTranslateY.value },
        { scale: lastScale.value },
      ],
    };
  });

  const calculateViewBox = () => {
    if (graph.nodes.length === 0) return `0 0 ${width} ${height}`;

    const padding = 50;
    const minX = Math.min(...graph.nodes.map((node) => node.x)) - padding;
    const minY = Math.min(...graph.nodes.map((node) => node.y)) - padding;
    const maxX = Math.max(...graph.nodes.map((node) => node.x)) + padding;
    const maxY = Math.max(...graph.nodes.map((node) => node.y)) + padding;
    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;

    return `${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <Svg width={width} height={height} viewBox={calculateViewBox()}>
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
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Graph;
