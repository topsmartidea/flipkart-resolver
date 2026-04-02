const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

let browser;

// 🔥 Launch browser safely
(async () => {
  try {
    browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote"
    ]
  });

    console.log("🚀 Browser Ready");

  } catch (e) {
    console.error("❌ Browser launch failed:", e.message);
  }
})();


// 🔥 Root check
app.get("/", (req, res) => {
  res.send("Flipkart Resolver API Running ✅");
});


// 🔥 Resolver API
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

    // 🔥 wait for redirect
    await new Promise(r => setTimeout(r, 5000));

    const finalUrl = page.url();

    await page.close();

    res.json({
      success: true,
      final_url: finalUrl
    });

  } catch (e) {

    if (page) await page.close();

    res.json({
      error: "resolver failed",
      message: e.message
    });

  }

});


// 🔥 PORT fix (important for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
