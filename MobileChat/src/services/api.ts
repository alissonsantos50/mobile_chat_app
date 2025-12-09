import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { API_URL_EMULATOR, API_URL_MOBILE_PHONE, API_PORT } from '@env';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export default api;

export function getApiBaseUrl() {
  const isEmulator = DeviceInfo.isEmulatorSync();
  if (isEmulator) return `${API_URL_EMULATOR}:${API_PORT}`;
  return `${API_URL_MOBILE_PHONE}:${API_PORT}`;
}
