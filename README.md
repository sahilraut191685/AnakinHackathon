# 🕵️ Deceive Agent

<p align="center">
  <b>AI-Powered Web Intelligence & Research Agent</b>
</p>

<p align="center">
  Search the web. Investigate the evidence. Connect the dots. Get the answer.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-Vite-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Anakin-Hackathon-orange?style=for-the-badge" />
</p>

---

## 🚨 The Problem

The internet contains an enormous amount of information.

But getting a **reliable, useful answer** still requires a lot of manual work:

**Search → Open multiple tabs → Read → Compare → Extract → Cross-check → Summarize**

Traditional search engines are excellent at finding webpages.

But **finding information is not the same as understanding it.**

Researchers, developers, students, and businesses waste valuable time collecting information from different sources and connecting the dots themselves.

---

## 💡 Our Solution

### Meet **Deceive Agent**

Deceive Agent is an **AI-powered web intelligence agent** that transforms a natural-language question into an automated research workflow.

Instead of simply returning links, Deceive Agent can:

- 🔎 Search the web
- 🌐 Discover relevant sources
- 📄 Extract webpage content
- 🧠 Understand retrieved information
- 🤖 Analyze information using an LLM
- 🔗 Combine insights from multiple sources
- 💬 Generate a consolidated response

### In simple terms:

> **You ask a question. The agent investigates the web and brings the information back to you.**

---

## ⚡ The Difference

### Traditional Search

**User → Search Engine → Links**

### Deceive Agent

**User → AI Agent → Search → Sources → Scrape → Analyze → Answer**

The key idea is to move from:

> **Information Retrieval**

to:

> **Information Investigation**

---

## 🧠 How Deceive Agent Works

```text
                         USER QUESTION
                               │
                               ▼
                    ┌────────────────────┐
                    │    AI RESEARCH     │
                    │       AGENT        │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │     WEB SEARCH     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │  RELEVANT SOURCES  │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    WEB SCRAPER     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ CONTENT EXTRACTION │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    LLM ANALYSIS    │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   INTELLIGENT      │
                    │      ANSWER        │
                    └────────────────────┘
```

---

## 🎯 Example

### User asks:

> **"What are the latest developments in AI agents and how are they changing software development?"**

Instead of simply returning:

- Article 1
- Article 2
- Article 3
- Article 4
- Article 5

Deceive Agent can perform a research workflow:

**Question**

↓

**Search multiple sources**

↓

**Identify relevant webpages**

↓

**Extract useful information**

↓

**Send context to the LLM**

↓

**Analyze and synthesize**

↓

**Generate a consolidated answer**

The result is not just a list of links.

It is an **AI-generated research response**.

---

## 🔥 Core Features

### 🔎 Intelligent Web Search

Find relevant information from the web based on the user's query.

### 🌐 Web Scraping

Go beyond search snippets by retrieving useful content from webpages.

### 🤖 LLM-Powered Analysis

Use an LLM to understand and synthesize retrieved information.

### 🔗 Multi-Source Research

Combine information from multiple webpages into one useful response.

### 💬 Natural Language Interface

Users don't need to understand APIs, search operators, or scraping.

They simply ask.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────┐
                         │      USER       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ REACT + VITE UI │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ EXPRESS SERVER  │
                         │      API        │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
      ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
      │ SEARCH        │   │ SCRAPER       │   │ LLM           │
      │ SERVICE       │   │ SERVICE       │   │ SERVICE       │
      └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
              │                   │                   │
              ▼                   ▼                   ▼
         ┌─────────┐        ┌──────────┐        ┌──────────┐
         │   WEB   │        │WEB PAGES │        │   LLM    │
         └─────────┘        └──────────┘        └──────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ SYNTHESIZED     │
                         │ AI RESPONSE     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      USER       │
                         └─────────────────┘
```

---

## 🧩 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Backend | Node.js |
| API Framework | Express.js |
| Language | JavaScript |
| AI | Large Language Model |
| Search | Web Search |
| Data Collection | Web Scraping |
| Configuration | dotenv |

---

## 📁 Project Structure

```text
AnakinHackathon/
│
├── deceive-agent/
│
│   ├── client/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   │
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── server/
│   │   ├── services/
│   │   │   ├── llmService.js
│   │   │   ├── scraperService.js
│   │   │   └── searchService.js
│   │   │
│   │   ├── index.js
│   │   └── package.json
│   │
│   └── README.md
│
└── README.md
```

---

## 🔄 End-to-End Workflow

### 1. Ask

The user provides a natural-language question.

### 2. Discover

The search service discovers relevant sources.

### 3. Retrieve

The scraper retrieves useful information from those sources.

### 4. Understand

The LLM receives the user's question together with the retrieved context.

### 5. Analyze

The model analyzes and synthesizes the information.

### 6. Respond

The final response is returned to the user.

---

## 🛠️ Core Services

### `searchService.js`

Handles web search and source discovery.

**Input:**

User query

**Output:**

Relevant search results and URLs

---

### `scraperService.js`

Retrieves and extracts useful content from webpages.

**Input:**

Webpage URL

**Output:**

Extracted webpage content

---

### `llmService.js`

Processes the user query and retrieved context using an LLM.

**Input:**

Query + Web Content

**Output:**

AI-generated response

---

### `index.js`

Main Express backend entry point responsible for server configuration and API communication.

---

## 🎯 Use Cases

### 👨‍💻 Developers

Research frameworks, libraries, APIs, tools, and technical solutions.

### 🎓 Students

Research technologies, academic topics, projects, and current developments.

### 🏢 Businesses

Research competitors, products, markets, and industry trends.

### 🔬 Researchers

Collect and synthesize information from multiple online sources.

### 📰 Information Analysis

Investigate current topics distributed across different websites.

---

## 🚀 Vision

Deceive Agent is not intended to remain a simple search interface.

Our vision is to evolve it into an **autonomous research system** capable of planning and executing complex investigations.

Future workflow:

```text
Understand Goal
      ↓
Create Research Plan
      ↓
Search Multiple Sources
      ↓
Run Parallel Investigations
      ↓
Extract Evidence
      ↓
Cross-Check Information
      ↓
Detect Conflicts
      ↓
Evaluate Sources
      ↓
Generate Research Report
```

---

## 🗺️ Roadmap

### Phase 1 — Core Intelligence

- [x] Web search
- [x] Web scraping
- [x] LLM integration
- [x] React frontend
- [x] Express backend

### Phase 2 — Research Intelligence

- [ ] Multi-source comparison
- [ ] Source credibility scoring
- [ ] Automatic fact verification
- [ ] Citation generation
- [ ] Better content extraction
- [ ] Query planning

### Phase 3 — Autonomous Agents

- [ ] Multi-agent architecture
- [ ] Parallel research
- [ ] Autonomous research planning
- [ ] Conflict detection
- [ ] Evidence graph
- [ ] Follow-up searches

### Phase 4 — Research Platform

- [ ] Research history
- [ ] Saved investigations
- [ ] PDF/document analysis
- [ ] AI-generated research reports
- [ ] Export to PDF/Markdown
- [ ] Authentication
- [ ] Collaboration

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### Clone the Repository

    git clone https://github.com/sahilraut191685/AnakinHackathon.git

    cd AnakinHackathon

---

## 💻 Frontend Setup

    cd deceive-agent/client

    npm install

    npm run dev

The frontend will normally be available at:

    http://localhost:5173

---

## ⚡ Backend Setup

Open another terminal:

    cd deceive-agent/server

    npm install

    npm run dev

The backend will normally run on:

    http://localhost:5000

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

    PORT=5000
    LLM_API_KEY=your_llm_api_key
    SEARCH_API_KEY=your_search_api_key

Never commit real API keys to GitHub.

Add the following to `.gitignore`:

    .env
    .env.local
    node_modules/
    dist/

---

## 🔒 Security

API keys and secrets should never be exposed in frontend code.

Use environment variables for sensitive configuration.

Before pushing to GitHub, make sure:

- `.env` is ignored
- API keys are not present in source code
- Secret credentials are not included in commits

---

## 🐛 Troubleshooting

### Backend doesn't start

Reinstall dependencies:

    npm install

If necessary, remove `node_modules` first.

Windows PowerShell:

    Remove-Item -Recurse -Force node_modules
    npm install

Linux/macOS:

    rm -rf node_modules
    npm install

### Frontend cannot connect to backend

Check:

- Backend server is running
- Correct backend URL
- Correct port
- CORS configuration
- Environment variables

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

### Create a feature branch

    git checkout -b feature/your-feature

### Make your changes

### Commit

    git add .
    git commit -m "Add your feature"

### Push

    git push origin feature/your-feature

Then open a Pull Request.

---

## 🏆 Anakin Hackathon

Deceive Agent was built for the **Anakin Hackathon**.

The project explores how AI agents can move beyond traditional search and help users **investigate, understand, and synthesize information from the web**.

---

## 👥 Team

### Sahil Raut & Team

Built with:

**☕ Code + 🤖 AI + 🧠 Curiosity + 🚀 Ambition**

---

## 📌 Project Status

🚧 **Active Development**

Current pipeline:

**SEARCH → SCRAPE → UNDERSTAND → ANALYZE → RESPOND**

The next step is turning this pipeline into a more autonomous research agent capable of planning and executing deeper investigations.

---

## 🌟 Why Deceive Agent?

The web already contains the answers.

The challenge is finding the right information, understanding it, and connecting it.

**Deceive Agent aims to make that process autonomous.**

---

<div align="center">

# 🕵️ DECEIVE AGENT

### Don't just search the web.
### **Investigate it.**

⭐ Star the repository if you like the idea.

yet we will are going to improve this project
</div>