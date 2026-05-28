import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickPrompts = [
  "Find projects by department",
  "Avoid duplicate topics",
  "How to submit my project",
  "Search publications",
];

interface AcademIQButtonProps {
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AcademIQButton({ externalOpen, onOpenChange }: AcademIQButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (onOpenChange) {
      onOpenChange(val);
    } else {
      setInternalOpen(val);
    }
  };

  const sendMessage = (text: string) => {
    const userMsg = { role: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Here is a demo reply about “${text}”. Wire this panel to your backend when you are ready to offer real search and curated suggestions.`,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button - Only show if not externally controlled or if specifically wanted */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1d3557] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 shadow-[#1d3557]/20"
          aria-label="Open help and quick prompts"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed right-0 top-0 h-full w-[400px] max-w-full bg-white border-l border-slate-200 shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="bg-[#1d3557] px-6 py-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm tracking-wide">AcademIQ Support</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">AI Academic Assistant</p>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.length === 0 && (
              <div className="space-y-6">
                <div className="bg-[#1d3557] rounded-2xl p-5 text-white shadow-lg">
                  <p className="text-xs font-medium leading-relaxed">
                    Welcome to AUCA Connect. I am your academic AI assistant. How can I help you navigate the repository today?
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        className="px-4 py-2 text-xs bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-[#1d3557] hover:border-[#1d3557]/30 transition-all border border-slate-200 shadow-sm"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-snug shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#1d3557] text-white rounded-br-none"
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-1.5 px-4 py-2 items-center">
                <div className="h-1.5 w-1.5 bg-[#1d3557] rounded-full animate-bounce" />
                <div className="h-1.5 w-1.5 bg-[#1d3557] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 bg-[#1d3557] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-6 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) sendMessage(input.trim());
              }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, grades, or help..."
                className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1d3557]/20 transition-all"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-12 w-12 bg-[#1d3557] hover:bg-[#2c4e7d] rounded-xl shadow-lg shadow-[#1d3557]/20" 
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
