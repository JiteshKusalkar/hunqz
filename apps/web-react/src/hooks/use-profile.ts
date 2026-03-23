import { useQuery } from '@tanstack/react-query';
import { getJson } from '@hunqz/api';
import type { Profile } from '@hunqz/images';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const QUERY_KEY = ['profile', 'msescortplus'] as const;

export function useProfile() {
  return useQuery<Profile>({
    queryKey: QUERY_KEY,
    queryFn: () => getJson<Profile>('/profiles/msescortplus', { baseUrl: API_BASE_URL }),
  });
}
