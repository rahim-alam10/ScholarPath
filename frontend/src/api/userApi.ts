import { apiRequest } from './client';
import { endpoints } from './endpoints';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  token: string;
  user: UserProfile;
};

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>(endpoints.login, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile() {
  return apiRequest<UserProfile>(endpoints.profile);
}
