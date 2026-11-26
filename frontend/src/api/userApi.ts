import { apiRequest } from './client';
import { endpoints } from './endpoints';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  academicProfile?: AcademicProfile;
};

export type AcademicProfile = {
  qualification: string;
  fieldOfStudy: string;
};

export type LoginResponse = {
  token: string;
  user: UserProfile;
};

export function register(
  name: string,
  email: string,
  password: string,
  academicProfile: AcademicProfile,
) {
  return apiRequest<LoginResponse>(endpoints.register, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, academicProfile }),
  });
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>(endpoints.login, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile(token: string) {
  return apiRequest<UserProfile>(endpoints.profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
