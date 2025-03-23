import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "../db/mongo-client"; // your mongodb client

// const db = client.db("better-auth-example");

export const auth = betterAuth({
  database: mongodbAdapter(client.db("SkillSwap")),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ["http://localhost:8080"],
});