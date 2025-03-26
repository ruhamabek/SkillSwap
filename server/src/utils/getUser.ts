// src/utils/user.ts
import { Request } from 'express';
import { auth } from '../lib/auth';
import userCookieInterface from '../interface/userCookieInterface';


export const getUser = async (req: Request): Promise<userCookieInterface | null> => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });

    const user = session?.user;
    if (!user || !user.id) {
      return null;
    }
    return user as userCookieInterface;
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};