export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type SubmissionTopic =
  | 'bubble'
  | 'scam'
  | 'environment'
  | 'obituary'
  | 'regulation'
  | 'other';

export type Platform =
  | 'twitter'
  | 'reddit'
  | 'youtube'
  | 'facebook'
  | 'linkedin'
  | 'news'
  | 'other';

export interface Submission {
  id: string;
  image_url: string;
  image_path: string;
  platform: Platform;
  source_date: string;
  topic: SubmissionTopic;
  language: 'en' | 'de';
  description: string | null;
  submitted_by_ip: string | null;
  status: SubmissionStatus;
  created_at: string;
  reviewed_at: string | null;
}

export const PLATFORMS: { value: Platform; label: string; labelDe: string }[] = [
  { value: 'twitter', label: 'Twitter / X', labelDe: 'Twitter / X' },
  { value: 'reddit', label: 'Reddit', labelDe: 'Reddit' },
  { value: 'youtube', label: 'YouTube', labelDe: 'YouTube' },
  { value: 'facebook', label: 'Facebook', labelDe: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn', labelDe: 'LinkedIn' },
  { value: 'news', label: 'News Outlet', labelDe: 'Nachrichtenportal' },
  { value: 'other', label: 'Other', labelDe: 'Sonstiges' },
];

export const TOPICS: { value: SubmissionTopic; label: string; labelDe: string; color: string }[] = [
  { value: 'bubble', label: 'Bubble', labelDe: 'Blase', color: '#e74c3c' },
  { value: 'scam', label: 'Scam', labelDe: 'Betrug', color: '#e67e22' },
  { value: 'environment', label: 'Environment', labelDe: 'Umwelt', color: '#27ae60' },
  { value: 'obituary', label: 'Obituary', labelDe: 'Nachruf', color: '#8e44ad' },
  { value: 'regulation', label: 'Regulation', labelDe: 'Regulierung', color: '#2980b9' },
  { value: 'other', label: 'Other', labelDe: 'Sonstiges', color: '#7f8c8d' },
];
