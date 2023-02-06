import GitHub from "@auth/core/providers/github";
import { SolidAuth, SolidAuthConfig } from "@auth/solid-start";

export const authOptions: SolidAuthConfig = {
  providers: [
    // @ts-expect-error Types are wrong
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
};

export const { GET, POST } = SolidAuth(authOptions);
