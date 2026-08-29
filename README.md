# LetterCraft 

A high-performance, responsive AI cover letter generator built with **Next.js (App Router)**, **TypeScript**, and the **Google Gemini API**. Designed to craft hyper-targeted, professional cover letters using an optimized single-call generation pipeline, on-demand refinement (capped at 3 iterations), global skill suggestions, local state persistence, and full mobile responsiveness.

---

## Features

* **Hyper-Targeted Generation**: Injects company context, job roles, and specific job descriptions directly into the AI workflow to produce custom-tailored applications.
* **On-Demand Refinement & Capping**: Allows users to polish and enhance their generated letter up to 3 times per session (`1/3`, `2/3`, `3/3`) to maintain quality and prevent prompt spamming.
* **Global Skills Autocomplete**: A built-in searchable database of worldwide industry skills with instant tag management.
* **State Persistence**: Automatic browser `localStorage` synchronization prevents data loss on accidental page refreshes without triggering SSR hydration mismatches.
* **Fully Responsive UI**: Mobile-optimized layout with adaptive grids, pulsating loading skeletons, live word counts, read-time estimations, and native print-to-PDF formatting.

---

##  Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Inline Design Tokens & Responsive CSS
* **AI Engine**: Google Gen AI SDK (`@google/genai`) — `gemini-3.6-flash`
* **Deployment**: Vercel

---

##  Getting Started

### Prerequisites
Ensure you have Node.js installed on your machine and a valid API key from [Google AI Studio](https://aistudio.google.com/).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/lettercraft.git](https://github.com/your-username/lettercraft.git)
   cd lettercraft
1 Install dependencies:npm install
 
 
2 Configure Environment Variables:
Create a file named .env.local in the root directory and add your Gemini API key:GEMINI_API_KEY=your_actual_api_key_here

3 Run the Development Server:npm run dev

4 Open in Browser:
Navigate to http://localhost:3000 to start building your cover letters.



lettercraft/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts  # Backend API endpoint interfacing with Google Gemini AI
│   │   ├── layout.tsx        # Root layout & font definitions
│   │   ├── page.tsx          # Multi-step wizard UI, state management, & output canvas
│   │   └── globals.css       # Global styling rules & animations
├── package.json
└── tsconfig.json