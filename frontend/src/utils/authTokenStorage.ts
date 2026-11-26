import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'scholarpath.authToken';

function getWebStorage() {
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('Secure session storage is unavailable in this browser.');
  }
  return globalThis.localStorage;
}

export function getStoredAuthToken() {
  return Platform.OS === 'web'
    ? Promise.resolve(getWebStorage().getItem(TOKEN_KEY))
    : SecureStore.getItemAsync(TOKEN_KEY);
}

export function storeAuthToken(token: string) {
  return Platform.OS === 'web'
    ? Promise.resolve(getWebStorage().setItem(TOKEN_KEY, token))
    : SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function removeStoredAuthToken() {
  return Platform.OS === 'web'
    ? Promise.resolve(getWebStorage().removeItem(TOKEN_KEY))
    : SecureStore.deleteItemAsync(TOKEN_KEY);
}
