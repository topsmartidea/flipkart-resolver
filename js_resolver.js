const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Flipkart Resolver API Running ✅");
});

app.get("/resolve", async (req, res) => {

  const url = req.query.url;

  if (!url) {
    return res.json({ error: "url missing" });
  }

  try {

    const response = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: null
    });

    const finalUrl = response.request.res.responseUrl;

    res.json({
      success: true,
      final_url: finalUrl
    });

  } catch (e) {
    res.json({
      error: "resolver failed",
      message: e.message
    });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
