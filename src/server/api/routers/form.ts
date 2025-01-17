import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;

if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
  throw new Error("Missing BrowserBase credentials");
}

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
  vehicleType: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.string(),
  color: z.string(),
  doc1URL: z.string(),
});

export const formRouter = createTRPCRouter({
  fillForm: publicProcedure
    .input(userInfoSchema)
    .mutation(async ({ input }) => {
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
          action: `Fill out the form with the following data: ${JSON.stringify(input)}`,
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
