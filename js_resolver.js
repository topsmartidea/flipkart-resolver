const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

let browser;

(async () => {
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled"
      ]
    });

    console.log("🚀 Browser Ready");

  } catch (e) {
    console.error("❌ Browser launch failed:", e.message);
  }
})();

app.get("/", (req, res) => {
  res.send("API Running ✅");
});

app.get("/resolve", async (req, res) => {

  if (!browser) {
    return res.json({
      error: "browser not initialized (hosting issue)"
    });
  }

  const url = req.query.url;

  if (!url) {
    return res.json({ error: "url missing" });
  }

  let page;

  try {
    page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 4000));

    const final = page.url();

    res.json({
      success: true,
      final_url: final
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
