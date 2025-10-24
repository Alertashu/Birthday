const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

if (!process.env.NAME) throw new Error("Please specify NAME in environment.");
if (!process.env.PIC) throw new Error("Please specify PIC in environment.");

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
    console.log("✅ Local build completed successfully.");
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    console.log("🧠 Fetching remote data...");

    // Fetch picture from remote URL
    let res = await axios.get(picPath, { responseType: "arraybuffer" });
    const pic = res.data;
    let markup = "";

    // Try to fetch scroll message if provided
    if (msgPath) {
      try {
        const article = msgPath.split("/").pop();
        res = await axios.get(
          `https://api.telegra.ph/getPage/${article}?return_content=true`
        );

        if (res.data && res.data.result && res.data.result.content) {
          const { content } = res.data.result;
          markup = content.reduce(
            (string, node) => string + generateMarkupRemote(node),
            ""
          );
          console.log("✅ Telegraph content loaded successfully.");
        } else {
          console.warn("⚠️ Telegraph content not found — proceeding without scroll message.");
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch Telegraph content — proceeding without scroll message.");
      }
    }

    await setPic(pic);
    genIndex(markup);
    console.log("✅ Remote build completed successfully.");

  } catch (e) {
    console.error("❌ Remote fetch failed:", e.message);
    throw new Error("Remote initialization failed. Check your PIC URL and network connection.");
  }
};

if (process.argv[2] === "--local") setLocalData();
else if (process.argv[2] === "--remote") setRemoteData();
else console.log("⚠️ Fetch mode not specified. Use --local or --remote");
