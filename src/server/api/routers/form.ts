import { z } from "zod";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

import { createTRPCRouter, publicProcedure } from "../trpc";

const userInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  liscensePlate: z.string(),
  permanentPlate: z.boolean(),
  make: z.string(),
  model: z.string(),
  year: z.string(),
  color: z.string(),
});

export const formRouter = createTRPCRouter({
  fillForm: publicProcedure
    .input(userInfoSchema)
    .mutation(async ({ input }) => {
        
    }),
});
