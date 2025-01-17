import { z } from "zod";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const formRouter = createTRPCRouter({
  getForms: publicProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.query.forms.findMany();
    return forms;
  }),

  getForm: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const form = await ctx.db.query.forms.findFirst({
        where: (form, { eq }) => eq(form.name, input.name),
      });
      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return form;
    }),
});
