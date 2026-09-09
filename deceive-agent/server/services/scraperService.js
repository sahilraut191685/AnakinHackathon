const axios = require("axios");
const cheerio = require("cheerio");

const MAX_CHARS = 5000;

/**
 * Scrape a website and extract its visible text content.
 * Strips scripts, styles, nav, footer, and other non-content elements.
 * Returns plain text truncated to ~5000 characters.
 *
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} - The extracted text or an error message
 */
async function scrapeWebsite(url) {
  try {
    // Validate URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return `Error: Invalid URL protocol "${parsedUrl.protocol}". Use http:// or https://`;
      }
    } catch {
      return `Error: Invalid URL "${url}". Please provide a valid URL starting with http:// or https://`;
    }

    // Fetch the page HTML
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        // Mimic a browser to avoid being blocked
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      maxRedirects: 5,
      // Don't download huge files (max 5MB)
      maxContentLength: 5 * 1024 * 1024,
    });

    // Ensure we got HTML, not a PDF/image/etc
    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return `Error: URL returned non-HTML content (${contentType}). Only HTML pages can be scraped.`;
    }

    const html = response.data;

    // Parse with cheerio
    const $ = cheerio.load(html);

    // Remove non-content elements
    $(
      "script, style, noscript, iframe, svg, canvas, " +
        "nav, footer, header, aside, " +
        "form, button, input, select, textarea, " +
        "[role='navigation'], [role='banner'], [role='contentinfo'], " +
        ".nav, .navbar, .footer, .sidebar, .menu, .ad, .ads, .advertisement, " +
        "#nav, #navbar, #footer, #sidebar, #menu, #cookie-banner"
    ).remove();

    // Extract text from the body
    let text = $("body").text();

    // Clean up whitespace:
    // - Replace multiple spaces/tabs with a single space
    // - Replace 3+ newlines with 2 newlines
    // - Trim each line
    text = text
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line.length > 0)
      .join("\n");

    // Remove excessive blank lines
    text = text.replace(/\n{3,}/g, "\n\n");

    // Truncate if too long
    if (text.length > MAX_CHARS) {
      text = text.substring(0, MAX_CHARS).trimEnd();
      // Don't cut in the middle of a word
      const lastSpace = text.lastIndexOf(" ");
      if (lastSpace > MAX_CHARS - 100) {
        text = text.substring(0, lastSpace);
      }
      text += "\n\n[... content truncated at ~5000 characters]";
    }

    if (!text || text.trim().length === 0) {
      return `Error: No visible text content found on ${url}. The page may be dynamically rendered (requires JavaScript).`;
    }

    return text;
  } catch (error) {
    // Handle specific error types
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return `Error: Request timed out while trying to reach ${url}. The site may be slow or unresponsive.`;
    }
    if (error.code === "ENOTFOUND") {
      return `Error: Could not resolve hostname for ${url}. Check if the URL is correct.`;
    }
    if (error.code === "ECONNREFUSED") {
      return `Error: Connection refused by ${url}. The server may be down.`;
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        return `Error: Access forbidden (403) — ${url} is blocking automated requests.`;
      }
      if (status === 404) {
        return `Error: Page not found (404) — ${url} does not exist.`;
      }
      if (status === 429) {
        return `Error: Rate limited (429) — too many requests to ${url}. Try again later.`;
      }
      return `Error: HTTP ${status} while fetching ${url}.`;
    }

    return `Error: Failed to scrape ${url} — ${error.message}`;
  }
}

module.exports = { scrapeWebsite };
