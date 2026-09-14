# Moolya (मूल्य) - Full-Stack Agricultural Marketplace & Voice AI Platform

Moolya is a full-stack, real-time web application designed to bridge the gap between farmers and verified buyers. The platform solves agricultural distribution challenges through AI-driven voice assistance (Devanagari Hindi & English), automated produce quality grading (Grade A, Grade B, Grade C), buyer trust & match scoring, direct dealing, and real-time STOMP/WebSocket voice deal notifications.

---

## 🌟 Key Features

### 1. Priority Localization & Voice First
- **Default Language**: Devanagari Hindi (`hi`) alongside standard English (`en`).
- **Language Toggle Switch**: Prominent switch across all dashboards. Default to Hindi for the Farmer Dashboard.
- **Voice AI Assistant**: Hindi Speech-to-Text (STT) and Text-to-Speech (TTS) using Web Speech API catering to farmers.

### 2. Authentication & Security Module
- **Farmer Registration & Security**:
  - Full Name, 10-Digit Mobile Number, State/District, and 12-Digit Aadhaar Number.
  - Strict client/server-side validation (regex for Aadhaar & Mobile).
  - Sensitive parameters (Aadhaar & passwords) encrypted at rest using AES-256 and BCrypt hashing.
- **Buyer Registration**:
  - Full Name, Phone Number, Email, Password.
  - Toggle for Account Type: `Individual / Self` or `Business / Enterprise` (with optional Business Name and GST/Tax ID).
- **Security**: Spring Security 6 with stateless JWT authentication.

### 3. Interactive AI Voice Produce Listing & Quality Engine
- **Voice Chatbot Modal**: Prominently triggered via "List New Product" (नया उत्पाद जोड़ें).
- Asks 6 sequential questions in spoken Hindi & text prompts:
  1. "कौन सी फसल बेचना चाहते हैं?" (Which crop do you want to sell?)
  2. "कितनी मात्रा (Quintals) उपलब्ध है?"
  3. "आपकी लोकेशन/गाँव कहाँ है?"
  4. "फसल कब काटी गई थी (Harvest Date)?"
  5. "फसल उगाते समय कौन से कीटनाशक इस्तेमाल हुए?"
  6. "आपका अपेक्षित मूल्य क्या है?"
- **Automated AI Quality Grading Engine**:
  - **Grade A**: Zero/minimal organic pesticides (Neem oil, organic), fresh harvest.
  - **Grade B**: Standard regulated pesticide usage, recent harvest.
  - **Grade C**: Higher chemical treatment or stored produce.
- **Strict Image Upload Rule**: Enforces mandatory upload of 4 to 5 produce photos before enabling submission.

### 4. Buyer Produce Search & Discovery Matrix
- Search bar + filters for Crop Name, Location, and Quality Grade (Grade A, B, C).
- Display listings with:
  - Farmer Name & Direct Contact Number.
  - Calculated **"Buyer Trust & Match Score"** (0–100% scale based on distance, quantity alignment, price, and seller history).
  - **Net Earnings Breakdown** (Estimated transport cost vs net farmer profit for transparency).

### 5. Real-Time STOMP/WebSocket Voice Notification & Deal Closing Loop
- Clicking **"Direct Interest / Order Request"** triggers an instant WebSocket message to the farmer.
- **Farmer Audio Alert**: Plays immediate audio alert in Hindi via TTS: `"[Buyer Name] को आपका [Crop Name] चाहिए।"`
- **Farmer Voice Reply**: Farmer responds via voice (e.g., `"मैं यह फसल 15 अप्रैल तक दे दूँगा"`), STT engine parses the target delivery date, confirms deal, and updates status in real time to the buyer.

---

## 🛠️ Tech Stack

- **Backend**: Java 17+, Spring Boot 3.2.4, Spring Data MongoDB, Spring Security (JWT + BCrypt), Spring WebSockets (`@EnableWebSocketMessageBroker`, STOMP over SockJS).
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Axios, `@stomp/stompjs`, `sockjs-client`, Web Speech API (STT & TTS).
- **Database**: MongoDB (`users`, `produce_listings`, `orders`, `requirements`).

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- Java 17+
- MongoDB running on `mongodb://localhost:27017`

### 1. Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🧪 Demo Credentials (Pre-seeded Data)

- **Sample Farmer**:
  - Phone: `9876543210`
  - Password: `password123`
  - Name: Ramesh Kumar (Ludhiana, Punjab)

- **Sample Buyer**:
  - Phone: `9123456789`
  - Password: `password123`
  - Name: Priya Sharma (AgroCorp Ltd, Delhi)
