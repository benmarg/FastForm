import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
  throw new Error("Missing BrowserBase credentials");
}

import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const formSubmitSchema = z.object({
  formId: z.number(),
  values: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    licensePlate: z.string(),
    permanentPlate: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.string(),
    color: z.string(),
    carInsuranceUrl: z.string(),
    dmvRegistrationUrl: z.string(),
  }),
});

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }
      return form;
    }),

  fillForm: publicProcedure
    .input(formSubmitSchema)
    .mutation(async ({ input: { formId, values } }) => {
      const stagehand = new Stagehand({
        apiKey: BROWSERBASE_API_KEY,
        projectId: BROWSERBASE_PROJECT_ID,
        env: "LOCAL" as const,
        launchOptions: {
          headless: false,
        },
        modelName: "claude-3-5-sonnet-20241022" /* Name of the model to use */,
        modelClientOptions: {
          apiKey: process.env.ANTHROPIC_API_KEY,
        } /* Configuration options for the model client */,
      });
      await stagehand.init();

      const page = stagehand.page;

      try {
        // Navigate to the form
        await page.goto(
          "https://www.sfmta.com/services/permits/residential-parking-permit-application",
        );

        // Fill out personal information
        await page.act({
          action: `Fill out the form with the following data: ${JSON.stringify(values)}`,
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Fill out address information

        // Extract form data to verify
        const formData = await page.extract({
          instruction: "extract all form field values",
          schema: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            address: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
            licensePlate: z.string(),
            make: z.string(),
            model: z.string(),
            year: z.string(),
            color: z.string(),
          }),
          useTextExtract: true,
        });

        // Close the browser
        await stagehand.close();

        return {
          success: true,
          data: formData,
        };
      } catch (error) {
        await stagehand.close();
        throw error;
      }
    }),
});
