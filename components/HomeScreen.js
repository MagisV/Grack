// HomeScreen.js
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite'
import { getAll } from '../database/CRUD';
import { CONVERSATION } from '../constants';

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

  return (
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
    </View>
  );
};

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={conversations}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.item}
//             onPress={() => navigation.navigate('Graph', { conversationId: item.id, initialData: item.data })}
//           >
//             <Text style={styles.itemText}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

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
