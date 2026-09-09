# 🕵️ Deceive Agent

An AI-powered web intelligence agent that searches the web, collects information from relevant sources, and uses an LLM to analyze and generate useful responses.

Built for the **Anakin Hackathon**.

---

## 🚀 Features

- 🔎 **Web Search** — Search the web for relevant information.
- 🌐 **Web Scraping** — Extract useful content from web pages.
- 🤖 **AI Analysis** — Uses an LLM to understand and process collected information.
- ⚡ **Backend API** — Express.js server connecting the frontend with AI and search services.
- 💻 **Modern Frontend** — React + Vite client application.
- 🔐 **Environment Variables** — API keys and configuration are stored securely using `.env`.

---

## 🏗️ Project Structure

```text
deceive-agent/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── services/
│   │   ├── llmService.js
│   │   ├── scraperService.js
│   │   └── searchService.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md

**This project is still yet to finsh**