import { useState } from "react";
import { MessageSquareMore } from "lucide-react";
import { API_URL, DEMO_USER_ID } from "./config";

const quickActions = [
  {
    type: "faq",
    extra: { topic: "shipping" },
    label: "Shipping",
    icon: "🚚",
  },
  {
    type: "check_status",
    extra: { referenceId: "REQ-1001" },
    label: "Order Status",
    icon: "📦",
  },
  {
    type: "ask",
    extra: { question: "What are your shipping times?" },
    label: "Ask AI",
    icon: "✨",
  },
  {
    type: "smart_ask",
    extra: { question: "Do you accept returns?" },
    label: "Smart Ask",
    icon: "🤖",
  },
  {
    type: "cancel_with_confirmation",
    extra: { referenceId: "REQ-1001" },
    label: "Cancel Order",
    icon: "↩️",
  },
  {
    type: "confirm_yes",
    extra: {},
    label: "Confirm",
    icon: "✅",
  },
  {
    type: "confirm_no",
    extra: {},
    label: "Decline",
    icon: "❌",
  },
  {
    type: "faq",
    extra: { topic: "payment" },
    label: "Payment",
    icon: "💳",
  },
];

function App() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! 👋 I'm your support assistant. How can I help you today?",
      sender: "agent",
    },
  ]);

  const [status, setStatus] = useState("Ready");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const sendQuery = async (type, extra = {}, displayText) => {
    addMessage(displayText ?? `[${type}]`, "user");
    setStatus("Typing...");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demoUserId: DEMO_USER_ID,
          type,
          ...extra,
        }),
      });

      const data = await res.json();

      console.log("Remaining:", data._remainingRequests);

      addMessage(data.message ?? JSON.stringify(data), "agent");

      setStatus("Online");
    } catch (err) {
      console.error(err);

      addMessage(
        "Sorry, I couldn't connect to the support server. Please make sure the demo server is running.",
        "agent",
      );

      setStatus("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (loading) return;

    sendQuery(action.type, action.extra, `${action.icon} ${action.label}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || loading) return;

    sendQuery("ask", { question: trimmedText }, trimmedText);

    setText("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Main App */}
      <div className="w-full max-w-3xl h-180 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-6 py-5">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-16 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-32 -bottom-20 w-44 h-44 bg-white/5 rounded-full" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                <MessageSquareMore />
              </div>

              <div>
                <h1 className="text-lg font-bold">DNotifier Support</h1>

                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                  </span>

                  <span className="text-xs text-blue-100">{status}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <span>🤖</span>
              AI Assistant
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Welcome Bar */}
          <div className="px-6 py-3 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-bold text-slate-800">
              How can we help you?
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Ask a question or choose an option below to get started.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex items-end gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                    🤖
                  </div>

                  <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-slate-200 bg-white px-5 sm:px-8 py-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Quick help
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickAction(action)}
                    className="
                      shrink-0
                      flex
                      items-center
                      gap-2
                      px-3.5
                      py-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      text-slate-600
                      text-xs
                      font-medium
                      hover:bg-blue-50
                      hover:border-blue-200
                      hover:text-blue-600
                      transition-all
                      duration-200
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="bg-white px-5 sm:px-8 pb-5">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={loading}
                  placeholder="Type your question..."
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-4
                    py-3
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                    disabled:opacity-50
                  "
                />

                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="
                    shrink-0
                    w-11
                    h-11
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                    hover:shadow-lg
                    hover:scale-105
                    transition-all
                    disabled:opacity-40
                    disabled:hover:scale-100
                    disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <span className="animate-spin text-lg">◌</span>
                  ) : (
                    <span className="text-lg">➤</span>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-2">
                AI responses may not always be accurate. Please verify important
                information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
