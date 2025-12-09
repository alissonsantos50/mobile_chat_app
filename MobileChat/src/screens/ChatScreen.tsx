import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChatScreenRouteProp } from '../navigation/AppStack';

interface User {
  _id: string | number;
  name?: string;
}

interface Message {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: User;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [tempIdCounter, setTempIdCounter] = useState(0);
  const { user: currentUser, webSocket } = useAuth();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const { userId: recipientId, name } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  useEffect(() => {
    webSocket.emit('get-message-history', { withUserId: recipientId });

    const handleMessageHistory = (history: Message[]) => {
      const formattedHistory = history
        .map(msg => ({
          ...msg,
          _id: msg._id,
          createdAt: new Date(msg.createdAt),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setMessages(formattedHistory);
    };

    const handleNewMessage = (newMessage: Message) => {
      if (
        newMessage.user._id === recipientId ||
        newMessage.user._id === currentUser?.id
      ) {
        setMessages(previousMessages => {
          const existingMessageIndex = previousMessages.findIndex(
            msg =>
              msg._id === newMessage._id ||
              (String(msg._id).startsWith('temp-') &&
                msg.text === newMessage.text),
          );

          if (existingMessageIndex > -1) {
            const updatedMessages = [...previousMessages];
            updatedMessages[existingMessageIndex] = {
              ...newMessage,
              createdAt: new Date(newMessage.createdAt),
            };
            return updatedMessages;
          }

          if (previousMessages.find(msg => msg._id === newMessage._id)) {
            return previousMessages;
          }

          return [
            {
              ...newMessage,
              createdAt: new Date(newMessage.createdAt),
            },
            ...previousMessages,
          ];
        });
      }
    };

    webSocket.on('message-history', handleMessageHistory);
    webSocket.on('new-message', handleNewMessage);

    return () => {
      webSocket.getSocket()?.off('message-history', handleMessageHistory);
      webSocket.getSocket()?.off('new-message', handleNewMessage);
    };
  }, [recipientId, webSocket, currentUser?.id]);

  const onSend = useCallback(() => {
    if (inputText.trim().length === 0) {
      return;
    }

    const tempId = `temp-${tempIdCounter}`;
    setTempIdCounter(prev => prev + 1);

    if (!currentUser) {
      return;
    }

    const newMessage: Message = {
      _id: tempId,
      text: inputText,
      createdAt: new Date(),
      user: {
        _id: currentUser.id,
        name: currentUser.name,
      },
    };

    setMessages(previousMessages => [newMessage, ...previousMessages]);

    const messageToSend = {
      text: inputText,
      recipientId: recipientId,
    };

    webSocket.emit('send-message', messageToSend);
    setInputText('');
  }, [inputText, webSocket, recipientId, currentUser, tempIdCounter]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.user._id === currentUser?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.recipientMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id.toString()}
        style={styles.messageList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Mensagem"
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  recipientMessage: {
    backgroundColor: '#EAEAEA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ChatScreen;
