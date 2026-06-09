import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { aiAPI } from '../lib/api';

interface Message {
  text: string;
  isUser: boolean;
}

const suggestions = [
  'ما هي طرق الدفع المتاحة؟',
  'كيف أطلب كتاباً؟',
  'ما هي سياسة التوصيل؟',
  'هل يوجد كتب للصف الثالث الثانوي؟',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: '👋 مرحباً بك في Book Beacon! أنا المساعد الذكي. كيف أستطيع مساعدتك اليوم؟', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg = { text: msg, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat(msg);
      setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
    } catch {
      setMessages((prev) => [...prev, { text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl shadow-primary-500/30 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-700"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-primary-600 to-primary-500 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">مساعد Book Beacon</span>
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                  </div>
                  <p className="text-[11px] text-white/70">نشط دائماً للمساعدة</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-dark-900/50">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-dark-600 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-500 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.isUser
                      ? 'bg-primary-500 text-white rounded-br-md shadow-sm'
                      : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                  <div className="bg-white dark:bg-dark-700 p-3 rounded-2xl shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 dark:border-dark-700 bg-white dark:bg-dark-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب سؤالك..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-gray-100 dark:border-dark-600"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
