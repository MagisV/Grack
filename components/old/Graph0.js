// Graph.js
import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

const Graph = ({ data }) => {
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Use d3 to create the graph layout
    const simulation = forceSimulation(data.nodes)
      .force('link', forceLink(data.links).id(d => d.id).distance(100))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        setGraph({
          nodes: [...simulation.nodes()],
          links: [...simulation.force('link').links()],
        });
      });

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <View>
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
    </View>
  );
};

export default Graph;
