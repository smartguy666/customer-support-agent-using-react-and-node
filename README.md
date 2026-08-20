# 🤖 DNotifier Customer Support Agent

An AI-powered Customer Support Agent built with **Node.js,React.js Express.js, MongoDB, and DNotifier**.

This project demonstrates how to build a customer support system that can receive customer messages, understand their intent, retrieve information from a Knowledge Base, handle status-related queries, and return helpful responses through a simple chat interface.

---

## ✨ Features

- 🤖 AI-powered customer support
- 💬 Real-time messaging with DNotifier
- 🧠 AI-based intent detection
- 📚 Knowledge Base integration
- ❓ FAQ handling
- 📦 Order/status query handling
- 🔄 WebSocket-based agent communication
- 🗄️ MongoDB integration
- 🚦 Rate limiting
- 🔐 Environment variable configuration
- 🌐 Simple frontend chat interface
- 🧩 Modular handler architecture
- 🛡️ Fallback responses for unsupported queries

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind Css
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- DNotifier
- WebSocket
- dotenv
- CORS

### AI

- DNotifier AI Agents
- DNotifier Knowledge Base
- Intent-based routing

---

## 🏗️ Architecture

The application follows this flow:

```text
Customer
   │
   ▼
Frontend Chat UI
   │
   ▼
Demo Server
   │
   ▼
DNotifier
   │
   ▼
Customer Support Agent
   │
   ├── Intent Detection
   │
   ├── FAQ / Knowledge Base
   │
   ├── Status Handler
   │
   └── Fallback Response
   │
   ▼
Customer Response
```

## 📁 Project Structure
```
dnotifier-customer-support-agent/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── ai/
│   │   │   ├── intentRouter.js
│   │   │   └── seedKnowledgeBase.js
│   │   │
│   │   ├── config/
│   │   │   └── business.config.js
│   │   │
│   │   ├── handlers/
│   │   │   ├── faq.handler.js
│   │   │   └── status.handler.js
│   │   │
│   │   ├── SupportAgent.js
│   │   ├── index.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```
## 🔌 DNotifier Integration

DNotifier is used as the real-time communication layer for the Customer Support Agent.

The backend connects to DNotifier using WebSocket transport.

Example:
import { DNotifier } from "@dnotifier-realtime/dnotifier";
import WebSocket from "ws";

const notifier = new DNotifier({
  appId: process.env.DNOTIFIER_APP_ID,
  secret: process.env.DNOTIFIER_SECRET,
  transport: "ws",
  userId: process.env.AGENT_ID,
  WebSocketImpl: WebSocket,
});
The agent listens for incoming messages and sends responses back through DNotifier.

🤖 Customer Support Agent

The SupportAgent is responsible for connecting the application to DNotifier and handling incoming customer messages.

A simplified example:
class SupportAgent {
  constructor(config) {
    this.notifier = new DNotifier({
      appId: config.appId,
      secret: config.secret,
      transport: "ws",
      userId: config.agentId,
      WebSocketImpl: WebSocket,
    });
  }

  async handleMessage(payload) {
    const query = payload.message;

    const response = await this.handleQuery(query);

    await this.notifier.send({
      userId: payload.senderId,
      message: response,
    });
  }
}
## 🧠 AI Intent Routing

The agent uses an intent router to determine what type of request the customer is making.

The basic flow is:

Customer Query
      │
      ▼
Intent Agent
      │
      ├── Status
      │
      └── General

For example:

"Where is my order?"
        ↓
Status Intent
"What is your return policy?"
        ↓
General / FAQ Intent

The intent router can use DNotifier AI capabilities to classify incoming customer queries.

Example:

const intentAgent = DNotifier.defineAgent({
  name: "intentAgent",


  async run(ctx) {
    const result = await ctx.sendAI({
      prompt: `
        Classify the customer's query as either:
        - status
        - general


        Query:
        ${ctx.message}
      `,
    });


    ctx.state.intent = result;
  },
});
## 📚 Knowledge Base

The Customer Support Agent uses a Knowledge Base to answer business-specific questions.

The Knowledge Base contains information such as:

Return policy
Shipping information
Business hours
Payment information
Other business FAQs

Example Knowledge Base records:

faq-returns
faq-shipping
faq-hours

The Knowledge Base can be seeded using:

await notifier.addDocument({
  recordId: `faq-${topic}`,
  content: answer,
});
💡 FAQ Configuration

Business FAQs are stored in the business configuration.

Example:

const businessConfig = {
  faqs: {
    hours: "Our business is open from 9 AM to 6 PM.",


    shipping:
      "Orders are usually delivered within 3 to 5 business days.",


    return_policy:
      "Returns are accepted within 7 days of delivery.",


    payment:
      "We accept major debit and credit cards.",
  },
};
❓ FAQ Handler

The FAQ handler checks whether a customer query matches an available FAQ topic.

Example structure:

registerHandler("faq", async ({ topic }) => {
  const answer = businessConfig.faqs[topic];


  if (!answer) {
    return {
      availableTopics: Object.keys(businessConfig.faqs),
    };
  }


  return {
    answer,
  };
});

This keeps FAQ-related logic separate from the main Customer Support Agent.

## 📦 Status Handler

The application also contains a status handler for status-related customer queries.
```
Example flow:

Customer
   │
   ▼
"Where is my order?"
   │
   ▼
Intent Router
   │
   ▼
Status Handler
   │
   ▼
Order / Status Information
```
The current implementation can use sample/mock records during development.

The same handler can later be connected to a real order database or external order management API.

## 🧩 Modular Handlers

Different customer support capabilities are separated into individual handlers.

handlers/
│
├── faq.handler.js
└── status.handler.js

This makes the project easier to maintain and extend.

Additional handlers can be added later, for example:

payment.handler.js
refund.handler.js
product.handler.js
complaint.handler.js
🧠 AI + Knowledge Base Flow

For general customer questions, the agent can use the Knowledge Base to retrieve relevant business information before generating a response.
```
Customer Question
       │
       ▼
Intent Detection
       │
       ▼
General Query
       │
       ▼
Knowledge Base Search
       │
       ▼
Relevant Information
       │
       ▼
AI Response
       │
       ▼
Customer
```
This allows the agent to answer questions based on the business's own information instead of relying only on general AI knowledge.
💬 Example Customer Queries

The agent can handle questions such as:

What is your return policy?

Example response:

Returns are accepted within 7 days of delivery.

Another example:

How long does shipping take?

Example response:

Orders are usually delivered within 3 to 5 business days.

Other example queries:

What are your business hours?
Where is my order?
What payment methods do you accept?
🌐 Frontend

The project includes a simple frontend chat interface built with:

HTML
CSS
JavaScript

The frontend allows users to enter customer support questions and receive responses from the backend.

Example frontend request:

const response = await fetch(
  "http://localhost:4000/api/support",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  }
);


const data = await response.json();
```
🔄 Frontend → Backend → Agent Flow
┌─────────────────┐
│    Customer     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Chat Frontend  │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│   Demo Server   │
│  localhost:4000 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    DNotifier    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Support Agent   │
└────────┬────────┘
         │
         ├───────────────┐
         ▼               ▼
┌────────────────┐ ┌────────────────┐
│ Intent Router  │ │ Knowledge Base │
└────────┬───────┘ └───────┬────────┘
         │                 │
         └────────┬────────┘
                  ▼
           ┌─────────────┐
           │  Response   │
           └──────┬──────┘
                  │
                  ▼
           ┌─────────────┐
           │  Customer   │
           └─────────────┘
🗄️ MongoDB
```

MongoDB is used as the application's database layer.

The backend uses Mongoose to connect to MongoDB.

Example:

import mongoose from "mongoose";


await mongoose.connect(process.env.MONGODB_URI);


console.log("MongoDB connected");

MongoDB can be used for application-specific data such as:

Customers
Orders
Products
Support conversations
Customer status
Other business data
⚙️ Environment Variables

Create a .env file inside the backend directory.

Example:

PORT=8000


MONGODB_URI=your_mongodb_connection_string


DNOTIFIER_APP_ID=your_dnotifier_app_id
DNOTIFIER_SECRET=your_dnotifier_secret


AGENT_ID=customer-support-agent

Important: Never commit your .env file or expose your DNotifier secret publicly.

Add .env to .gitignore:

.env
node_modules/
📦 Installation

Clone the repository:

git clone <your-repository-url>

Go to the backend directory:

cd backend

Install dependencies:

npm install

Create your .env file and add the required environment variables.

▶️ Run the Backend

Start the development server:

npm run dev

This runs:

nodemon src/index.js

Example output:

[nodemon] starting `node src/index.js`


MongoDB connected
Server running on port 8000
🧪 Run the Demo Server

The project also includes a demo server for testing the frontend with the Customer Support Agent.

Run:

npm run demo-server

This starts:

http://localhost:4000

The demo server acts as a bridge between the frontend chat interface and the Customer Support Agent.

🔐 Security

DNotifier credentials are kept on the backend.

The frontend should never contain:

DNOTIFIER_SECRET
DNOTIFIER_APP_ID

Instead, the frontend communicates with the application's backend API.

This prevents sensitive credentials from being exposed to users.

🛡️ Fallback Handling

If the agent cannot find an appropriate answer, it can return a fallback message instead of providing an unreliable response.

Example:

const fallbackMessage =
  "Sorry, I couldn't find an answer to your question. Please contact our support team.";

This provides a safer response for unsupported queries.

🚦 Rate Limiting

The support agent can apply a rate limit to control incoming requests.

Example:

const businessConfig = {
  rateLimit: {
    windowMs: 60 * 1000,
    maxRequests: 30,
  },
};

Rate limiting helps prevent excessive requests to the support agent.

🧪 Testing

After starting the backend and demo server, test the agent using questions such as:

What is your return policy?
How long does shipping take?
What are your business hours?
Where is my order?
What payment methods do you accept?
📋 Example Project Flow

A typical customer request follows this process:
```
1. Customer enters a question
          ↓
2. Frontend sends the question
          ↓
3. Demo server receives the request
          ↓
4. DNotifier communicates with the Support Agent
          ↓
5. Intent is determined
          ↓
6. Appropriate handler / Knowledge Base is used
          ↓
7. Agent generates the response
          ↓
8. Response is returned to the customer
```
## 🚧 Future Improvements

Possible improvements for the project include:

Connect real order management APIs
Add customer authentication
Store conversation history
Add human-agent escalation
Add more support handlers
Improve intent classification
Add analytics
Add multilingual support
Add persistent conversation storage
Deploy the application to production
Add an admin/support dashboard
🎯 Project Goal

The goal of this project is to demonstrate how a Customer Support AI Agent can be built using DNotifier with a Node.js backend.

The application provides its own frontend and backend while using DNotifier for real-time agent communication.

The architecture keeps the DNotifier credentials on the server and allows customers to interact with the support agent through the application's own interface.

