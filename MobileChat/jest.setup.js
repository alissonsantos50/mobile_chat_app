jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

global.__reanimatedWorkletInit = jest.fn();

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-device-info', () => {
  return {
    isEmulator: jest.fn().mockResolvedValue(false),
    isEmulatorSync: jest.fn().mockReturnValue(false),
  };
});

jest.mock('react-native-keyboard-controller', () => {
  return {
    KeyboardController: {
      setDefaultMode: jest.fn(),
    },
  };
});
