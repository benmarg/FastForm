import { BrowserBase } from "@browserbase/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userInfo = await request.json();

    const bb = new BrowserBase({
      apiKey: process.env.BROWSERBASE_API_KEY!,
    });

    const browser = await bb.launch();
    const page = await browser.newPage();

    // Navigate to the SFMTA form
    await page.goto(
      "https://www.sfmta.com/services/permits/residential-parking-permit-application",
    );

    // Fill out the form
    // Note: You'll need to replace these selectors with the actual ones from the form
    await page.fill('input[name="firstName"]', userInfo.firstName);
    await page.fill('input[name="lastName"]', userInfo.lastName);
    await page.fill('input[name="email"]', userInfo.email);
    await page.fill('input[name="phone"]', userInfo.phone);
    await page.fill('input[name="address"]', userInfo.address);
    await page.fill('input[name="city"]', userInfo.city);
    await page.fill('input[name="state"]', userInfo.state);
    await page.fill('input[name="zip"]', userInfo.zip);
    await page.fill('input[name="licensePlate"]', userInfo.liscensePlate);
    await page.fill('input[name="make"]', userInfo.make);
    await page.fill('input[name="model"]', userInfo.model);
    await page.fill('input[name="year"]', userInfo.year);
    await page.fill('input[name="color"]', userInfo.color);

    if (userInfo.permanentPlate) {
      await page.click('input[name="permanentPlate"]');
    }

    // Optional: Submit the form
    // await page.click('button[type="submit"]');

    await browser.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in fillForm API:", error);
    return NextResponse.json(
      { error: "Failed to fill out form" },
      { status: 500 },
    );
  }
}
