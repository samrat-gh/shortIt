import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";

export const getAuthSession = () => getServerSession(authOptions);

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const getCurrentUser = async () => {
  const session = await getAuthSession();
  //   console.log("session", session);
  if (!session?.user.name) {
    return undefined;
  }
  return session.user as UserInterface;
};
