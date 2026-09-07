import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'hg_admin_session';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const current = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!current || !env.ADMIN_PASSWORD) return false;
  return safeEqual(current, await adminSessionToken());
}

export async function verifyAdminPassword(password: string) {
  if (!env.ADMIN_PASSWORD) return false;
  return safeEqual(password, env.ADMIN_PASSWORD);
}

export async function adminSessionToken() {
  const data = new TextEncoder().encode(`hg-noivado:${env.ADMIN_PASSWORD}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}
