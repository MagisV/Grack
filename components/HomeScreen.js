// HomeScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const conversations = [
  { id: '1', name: 'Conversation 1', data: { nodes: [{ id: '1', name: 'Node A1' }, { id: '2', name: 'Node B1' }], links: [{ source: '1', target: '2' }] } },
  { id: '2', name: 'Conversation 2', data: { nodes: [{ id: '1', name: 'Node A2' }, { id: '2', name: 'Node B2' }], links: [{ source: '1', target: '2' }] } },
  { 
    id: '3', 
    name: 'Conversation 3', 
    data: { 
      nodes: [
        { id: '1', name: 'Node A3' }, 
        { id: '2', name: 'Node B3' },
        { id: '3', name: 'Node C3' },
        { id: '4', name: 'Node D3' } 
      ], 
      links: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
      ] 
    } 
  }
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Graph', { conversationId: item.id, initialData: item.data })}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
  },
});

export default HomeScreen;
