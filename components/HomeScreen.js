// HomeScreen.js
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getAll, insertConversation } from '../database/CRUD';
import { CONVERSATION } from '../constants';
import { PaperProvider, FAB } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const db = useSQLiteContext();

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await getAll(db, CONVERSATION);
        setConversations(conversations);
        console.log('Conversations fetched', conversations);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };

    fetchConversations();
  }, [db]);

  const handleAddConversation = async () => {
    const newConversationId = await insertConversation(db, 'New Conversation');
    if (newConversationId) {
      setConversations([...conversations, { id: newConversationId, name: 'New Conversation' }]);
      navigation.navigate('Graph', { conversationId: newConversationId });
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('Graph', { conversationId: item.id })}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={handleAddConversation}
        />
      </View>
    </PaperProvider>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
