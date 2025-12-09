/* eslint-disable react-native/no-inline-styles */
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  online: boolean;
}

const ContactListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { webSocket, user: currentUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      webSocket.emit('get-user-list');
      const handleUserList = (userList: User[]) => {
        const otherUsers = userList.filter(u => u.id !== currentUser?.id);
        setUsers(otherUsers);
      };

      webSocket.on('user-list', handleUserList);

      return () => {
        webSocket.getSocket()?.off('user-list', handleUserList);
      };
    }, [webSocket, currentUser]),
  );

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Chat', { userId: item.id, name: item.name })
      }
    >
      <View style={styles.userContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: item.online ? '#4CD964' : '#C7C7CC' },
          ]}
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum usuário online.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default ContactListScreen;
