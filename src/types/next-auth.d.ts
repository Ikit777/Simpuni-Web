import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      token_type: string;
      access_token: string;
      expires_in: string;
    };
  }

  interface User {
    id: string;
    name: string;
    token_type: string;
    access_token: string;
    expires_in: string;
  }
}
