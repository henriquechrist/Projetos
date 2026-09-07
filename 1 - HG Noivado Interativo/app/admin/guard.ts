import { env } from 'cloudflare:workers';
import { requireChatGPTUser } from '@/app/chatgpt-auth';

export async function requireAdmin(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  if (!env.ADMIN_USER_ID || user.userId !== env.ADMIN_USER_ID) return null;
  return user;
}
