import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppStack';
import api from '../services/api';

interface Conversation {
  partner: {
    id: string;
    publicId: string;
    name: string;
  };
  lastMessage: {
    id: string;
    publicId: string;
    text: string;
    createdAt: string;
  };
}

const ChatListScreen: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigation = useNavigation<AppStackNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchConversations = async () => {
        setLoading(true);
        try {
          const { data } = await api.get('/conversations', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (isActive) {
            setConversations(data || []);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      if (token) {
        fetchConversations();
      } else {
        setLoading(false);
      }

      return () => {
        isActive = false;
      };
    }, [token]),
  );

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('Chat', {
          userId: item.partner.publicId,
          name: item.partner.name,
        })
      }
    >
      <View>
        <Text style={styles.name}>{item.partner.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage.text}</Text>
      </View>
      <Text style={styles.time}>
        {new Date(item.lastMessage.createdAt).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.partner.id}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhuma conversa.</Text>
          </View>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default ChatListScreen;
