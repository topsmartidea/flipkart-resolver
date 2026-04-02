const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();

let browser;

async function startServer() {
  try {

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    console.log("🚀 Browser Ready");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log("Server running on " + PORT);
    });

  } catch (e) {
    console.error("❌ Browser launch failed:", e.message);
  }
}

// routes
app.get("/", (req, res) => {
  res.send("Flipkart Resolver API Running ✅");
});

app.get("/resolve", async (req, res) => {

  if (!browser) {
    return res.json({
      error: "browser not initialized"
    });
  }

  const url = req.query.url;

  if (!url) {
    return res.json({ error: "url missing" });
  }

  let page;

  try {
    page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 5000));

    const finalUrl = page.url();

    res.json({
      success: true,
      final_url: finalUrl
    });

  } catch (e) {
    res.json({
      error: "resolver failed",
      message: e.message
    });
  } finally {
    if (page) await page.close();
  }

});

startServer();
