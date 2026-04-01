"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SendIcon, LoaderIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import { useTextSelection } from "@/hooks/useTextSelection";
import { TextShimmer } from "@/components/ui/TextShimmer";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(
          textarea.scrollHeight,
          maxHeight ?? Number.POSITIVE_INFINITY
        )
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex-1", containerClassName)}>
        <textarea
          className={cn(
            "w-full bg-transparent border-none outline-none resize-none",
            "text-white/90 text-sm placeholder:text-white/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

interface AIChatInputProps {
  onSend?: (text: string) => void;
}

export function AnimatedAIChat({ onSend }: AIChatInputProps = {}) {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [, startTransition] = useTransition();
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 28,
    maxHeight: 160,
  });

  const selection = useTextSelection(textareaRef);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) { handleSendMessage(); }
    }
  };

  const handleSendMessage = () => {
    if (value.trim()) {
      onSend?.(value.trim());
      startTransition(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setValue("");
          adjustHeight(true);
        }, 3000);
      });
    }
  };

  const handleEnhance = async () => {
    if (!selection.hasSelection || isEnhancing) return;

    const { selectedText, selectionStart, selectionEnd } = selection;
    const before = value.substring(0, selectionStart);
    const after = value.substring(selectionEnd);

    setIsEnhancing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system:
            'You are a sales message rewriter. Apply the Jagged Writing Protocol. ' +
            'Short sentences. No fluff. No AI words. Real human attitude. ' +
            'Keep the same core meaning. Return ONLY the rewritten text. Nothing else.',
          messages: [
            { role: 'user', content: `Rewrite: "${selectedText}"` },
          ],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const enhanced: string = data.content[0].text.trim().replace(/^"|"$/g, '');

      setValue(before + enhanced + after);
      adjustHeight();
    } catch (err) {
      console.error('Enhance failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full px-8 h-14 bg-white/[0.03] text-white relative">

      {/* Enhance button — floats above the bar */}
      <AnimatePresence>
        {selection.hasSelection && !isEnhancing && (
          <motion.button
            key="enhance-btn"
            type="button"
            onClick={handleEnhance}
            className="absolute z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
            style={{
              bottom: '100%',
              left: '32px',
              marginBottom: '8px',
              background: 'linear-gradient(90deg, #de3582, #5e2e88)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Sparkles size={11} />
            Enhance
          </motion.button>
        )}
      </AnimatePresence>

      {/* Shimmer overlay while enhancing */}
      <AnimatePresence>
        {isEnhancing && (
          <motion.div
            className="absolute inset-0 flex items-center px-8 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextShimmer className="text-sm text-white/70">
              Enhancing your message...
            </TextShimmer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={isEnhancing}
        className={cn(
          "py-2",
          "min-h-[28px]",
          isEnhancing && "opacity-30"
        )}
        style={{ overflow: "hidden" }}
      />

      {/* Send button */}
      <motion.button
        type="button"
        onClick={handleSendMessage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTyping || isEnhancing || !value.trim()}
        className={cn(
          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all",
          value.trim()
            ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
            : "bg-white/[0.05] text-white/40"
        )}
      >
        {isTyping ? (
          <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
        ) : (
          <SendIcon className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)" }}
        />
      ))}
    </div>
  );
}

// Keep TypingDots export-ready if needed elsewhere
export { TypingDots };
