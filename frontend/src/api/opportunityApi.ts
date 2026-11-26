import { endpoints } from './endpoints';
import { apiRequest } from './client';

export type Scholarship = {
  id: string;
  slug?: string;
  title: string;
  provider: string;
  description?: string;
  country?: string;
  degreeLevels: string[];
  fieldsOfStudy: string[];
  funding?: string;
  deadline?: string;
  applicationUrl?: string;
  eligibilityCriteria: string[];
};

export type ResearchOpportunity = {
  id: string;
  slug?: string;
  title: string;
  institution: string;
  country?: string;
  kind?: string;
  funding?: string;
  topics: string[];
  deadline?: string;
  description?: string;
  supervisorName?: string;
  applicationUrl?: string;
};

export function getScholarships() {
  return apiRequest<Scholarship[]>(endpoints.scholarships);
}

export function getScholarship(slug: string) {
  return apiRequest<Scholarship>(`${endpoints.scholarships}/${encodeURIComponent(slug)}`);
}

export function getResearchOpportunities() {
  return apiRequest<ResearchOpportunity[]>(endpoints.research);
}

export function getResearchOpportunity(slug: string) {
  return apiRequest<ResearchOpportunity>(`${endpoints.research}/${encodeURIComponent(slug)}`);
}