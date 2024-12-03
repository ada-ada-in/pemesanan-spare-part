import { guard, Guard } from "@/libs/middleware";
import { GetRole } from "@/libs/manageRole";
import { GetServerSidePropsContext } from "next";

export async function authenticateUser(
  context: GetServerSidePropsContext
): Promise<{ isLogin: boolean; token?: string; role?: string }> {
  const [isLogin, token]: Guard = guard(context);

  if (!isLogin) {
    return { isLogin: false };
  }

  const role = await GetRole(token);
  return { isLogin, token, role };
}
