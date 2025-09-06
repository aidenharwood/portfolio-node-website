export interface BadgesResponse {
  appName: string;
  appUrl: string;
  badgeUrl: string;
}

export async function getBadges(): Promise<BadgesResponse[]> {
  const res = await fetch(`/api/argocd/badges`);
  return await res.json();
}
