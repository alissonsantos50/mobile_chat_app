/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RouteProp } from '@react-navigation/native';

import ChatListScreen from '../screens/ChatListScreen';
import ContactListScreen from '../screens/ContactListScreen';
import ChatScreen from '../screens/ChatScreen';
import { useAuth } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';

export type AppStackParamList = {
  Main: undefined;
  Chat: {
    userId: string;
    name: string;
  };
};

export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
export type ChatScreenRouteProp = RouteProp<AppStackParamList, 'Chat'>;

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

const LogoutButton = () => {
  const { signOut } = useAuth();
  return (
    <TouchableOpacity onPress={signOut} style={{ marginRight: 10 }}>
      <MaterialIcons name="logout" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => <LogoutButton />,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-outline';

          if (route.name === 'Conversas') {
            iconName = 'chat';
          } else if (route.name === 'Contatos') {
            iconName = 'contacts';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Conversas" component={ChatListScreen} />
      <Tab.Screen name="Contatos" component={ContactListScreen} />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
