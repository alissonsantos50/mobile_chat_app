module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(jest-)?@?react-native|@react-navigation|react-native-reanimated|react-native-keyboard-controller|react-native-uuid|react-native-device-info|react-native-worklets)',
  ],
};
