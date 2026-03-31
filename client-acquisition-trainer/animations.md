# Animation Components — Client Acquisition Trainer

All 12 components with full integration prompts. Copy each prompt exactly into Claude Code when implementing that component.

---

## Animation Plan

| Trigger | Animation | Library |
|---|---|---|
| Hero CTA click | Hero slides up, app shell fades in | Framer Motion |
| Tab switch | Content cross-fades, slight Y slide | Framer Motion |
| Cards mount | Staggered fade-up (40ms delay each) | Framer Motion |
| Card hover | Y: -2px, border accent | CSS transition |
| Card expand | Height animates open | Framer Motion layout |
| Persona select → chat | Cards scale down + fade, chat slides in | Framer Motion |
| Client message in | Bubble fades + slides in from left | Framer Motion |
| Your message in | Bubble fades + slides in from right | Framer Motion |
| AI idle | Voice orb breathes slowly | VoicePoweredOrb |
| AI generating | Voice orb pulses faster | VoicePoweredOrb |
| Send button | Scale(0.96) on press | CSS active state |

---

## Component Map

| App Section | Component | 21st.dev URL |
|---|---|---|
| Hero headline | Typewriter Effect | 21st.dev/community/components/aceternity/typewriter-effect |
| Hero CTA | Shimmer Button | 21st.dev/community/components/dillionverma/shimmer-button |
| Hero background | Gradient Dots | 21st.dev/community/components/bundui/fluid-particles-background |
| Global cursor | Spotlight Cursor | 21st.dev/uilayout.contact/spotlight-cursor |
| All cards (hover) | Card Spotlight (highlight-card) | 21st.dev/community/components/aceternity/card-spotlight |
| All cards (border) | Glowing Effect | 21st.dev/community/components/aceternity/glowing-effect |
| Card text mount | Animated Text | 21st.dev/community/components/bundui/animated-text |
| Chat bubbles | Chat Bubble | 21st.dev/community/components/jakobhoeg/chat-bubble |
| Chat input | AI Chat Input | 21st.dev/community/components/preetsuthar17/ai-chat-input |
| AI idle + active | Voice Powered Orb | 21st.dev/community/components/isaiahbjork/voice-powered-orb/default |
| Persona select | Profile Card | 21st.dev/community/components/isaiahbjork/profile-card/default |

---

---

## 1. Typewriter Effect — Hero Headline

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
typewriter-effect.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

demo.tsx

"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "Build" },
    { text: "awesome" },
    { text: "apps" },
    { text: "with" },
    { text: "Aceternity.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}
```

Install NPM dependencies:

```bash
framer-motion
```

---

## 2. Shimmer Button — Hero CTA

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
shimmer-button.tsx

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}
        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            // transition
            "transform-gpu transition-all duration-300 ease-in-out",
            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            // on click
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
          )}
        />
        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };

demo.tsx

import { ShimmerButton } from "@/components/ui/shimmer-button"

function ShimmerButtonDemo() {
  return (
    <div className="z-10 flex min-h-64 items-center justify-center">
      <ShimmerButton className="shadow-2xl">
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Shimmer Button
        </span>
      </ShimmerButton>
    </div>
  );
}

export default { ShimmerButtonDemo };
```

Extend existing tailwind.config.js with this code:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
      keyframes: {
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
    },
  },
};
```

---

## 3. Gradient Dots — Hero Background

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
gradient-dots.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
  /** Dot size (default: 8) */
  dotSize?: number;
  /** Spacing between dots (default: 10) */
  spacing?: number;
  /** Animation duration (default: 30) */
  duration?: number;
  /** Color cycle duration (default: 6) */
  colorCycleDuration?: number;
  /** Background color (default: 'var(--background)') */
  backgroundColor?: string;
};

export function GradientDots({
  dotSize = 8,
  spacing = 10,
  duration = 30,
  colorCycleDuration = 6,
  backgroundColor = 'var(--background)',
  className,
  ...props
}: GradientDotsProps) {
  const hexSpacing = spacing * 1.732; // Hexagonal spacing calculation

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
          radial-gradient(circle at 50% 50%, transparent 1.5px, ${backgroundColor} 0 ${dotSize}px, transparent ${dotSize}px),
          radial-gradient(circle at 50% 50%, #f00, transparent 60%),
          radial-gradient(circle at 50% 50%, #ff0, transparent 60%),
          radial-gradient(circle at 50% 50%, #0f0, transparent 60%),
          radial-gradient(ellipse at 50% 50%, #00f, transparent 60%)
        `,
        backgroundSize: `
          ${spacing}px ${hexSpacing}px,
          ${spacing}px ${hexSpacing}px,
          200% 200%,
          200% 200%,
          200% 200%,
          200% ${hexSpacing}px
        `,
        backgroundPosition: `
          0px 0px, ${spacing / 2}px ${hexSpacing / 2}px,
          0% 0%,
          0% 0%,
          0% 0px
        `,
      }}
      animate={{
        backgroundPosition: [
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px, 0% 0%, 0% 0%, 0% 0%, 0% 0%`,
        ],
        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
      }}
      transition={{
        backgroundPosition: {
          duration: duration,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        },
        filter: {
          duration: colorCycleDuration,
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        },
      }}
      {...props}
    />
  );
}

demo.tsx

import { GradientDots } from "@/components/ui/gradient-dots";

export default function DefaultDemo() {
  return (
    <main className="relative flex size-full min-h-screen w-full items-center justify-center">
      <GradientDots duration={20} />
      <h1 className="text-6xl text-center font-extrabold z-10">Gradient Dots</h1>
    </main>
  );
}
```

Install NPM dependencies:

```bash
framer-motion
```

Implementation Guidelines

1. Analyze the component structure and identify all required dependencies
2. Review the component's arguments and state
3. Identify any required context providers or hooks and install them
4. Questions to Ask
   - What data/props will be passed to this component?
   - Are there any specific state management requirements?
   - Are there any required assets (images, icons, etc.)?
   - What is the expected responsive behavior?
   - What is the best place to use this component in the app?

Steps to integrate

0. Copy paste all the code above in the correct directories
1. Install external dependencies
2. Fill image assets with Unsplash stock images you know exist
3. Use lucide-react icons for svgs or logos if component requires them

---

## 4. Spotlight Cursor — Global Cursor Effect

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
spotlight-cursor.tsx

'use client';

import { useRef, useEffect, HTMLAttributes } from 'react';

interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number;
}

const useSpotlightEffect = (config: SpotlightConfig) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseX !== -1000 && mouseY !== -1000) {
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, config.radius || 200
        );

        const rgbColor = hexToRgb(config.color || '#ffffff');

        gradient.addColorStop(0, `rgba(${rgbColor}, ${config.brightness || 0.15})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config.radius, config.brightness, config.color]);

  return canvasRef;
};

interface ComponentProps extends HTMLAttributes<HTMLCanvasElement> {
  config?: SpotlightConfig;
}

export const Component = ({
  config = {},
  className,
  ...rest
}: ComponentProps) => {
  const spotlightConfig = {
    radius: 200,
    brightness: 0.15,
    color: '#ffffff',
    smoothing: 0.1,
    ...config,
  };

  const canvasRef = useSpotlightEffect(spotlightConfig);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] w-full h-full ${className}`}
      {...rest}
    />
  );
};

demo.tsx

import { Component } from "@/components/ui/spotlight-cursor";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black overflow-hidden">
      <h1 className="text-white text-4xl font-bold z-10 pointer-events-none">Move your mouse!</h1>
      <Component />
    </div>
  );
};

export { DemoOne };
```

Implementation Guidelines

1. Analyze the component structure and identify all required dependencies
2. Review the component's arguments and state
3. Identify any required context providers or hooks and install them
4. Steps to integrate:
   0. Copy paste all the code above in the correct directories
   1. Install external dependencies
   2. Fill image assets with Unsplash stock images you know exist
   3. Use lucide-react icons for svgs or logos if component requires them

---

## 5. Card Spotlight — All Cards Hover

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
highlight-card.tsx

"use client";

import { FC, ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ComponentProps {
  title: string;
  description: string[];
  icon?: ReactNode;
}

const Component: FC<ComponentProps> = ({ title, description, icon }) => {
  return (
    <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
      <Card className="text-white rounded-2xl border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-white/25 hover:shadow-white/5 hover:shadow-3xl w-[350px]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700 animate-bounce"></div>
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/5 blur-xl animate-ping"></div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-white/5 blur-lg animate-ping"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </div>

        <div className="p-8 relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse"></div>
            <div className="p-6 rounded-full backdrop-blur-lg border border-white/20 bg-gradient-to-br from-black/80 to-black/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-white/20">
              <div className="transform group-hover:rotate-180 transition-transform duration-700">
                {icon}
              </div>
            </div>
          </div>

          <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse transform group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>

          <div className="space-y-1 max-w-sm">
            {description.map((line, idx) => (
              <p
                key={idx}
                className="text-gray-300 text-sm leading-relaxed transform group-hover:text-gray-200 transition-colors duration-300"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500 animate-pulse"></div>

          <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </div>
  );
};

export default Component;

demo.tsx

import Component from "@/components/ui/highlight-card";
import { Rocket } from "lucide-react";

export default function DemoOne() {
  return (
    <Component
      title="Space Explorer"
      description={[
        "Embark on interstellar adventures,",
        "discover new planets and galaxies,",
        "share your discoveries with friends,",
        "and reach for the stars together."
      ]}
      icon={<Rocket className="w-8 h-8 text-white" />}
    />
  );
}
```

Copy-paste these files for dependencies:

```tsx
shadcn/card

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

Implementation Guidelines

1. Analyze the component structure and identify all required dependencies
2. Review the component's arguments and state
3. Identify any required context providers or hooks and install them
4. Steps to integrate:
   0. Copy paste all the code above in the correct directories
   1. Install external dependencies
   2. Fill image assets with Unsplash stock images you know exist
   3. Use lucide-react icons for svgs or logos if component requires them

---

## 6. Glowing Effect — All Cards Border

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
glowing-effect.tsx

"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;

          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      var(--black),
                      var(--black) calc(25% / var(--repeating-conic-gradient-times))
                    )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                    radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                    radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
                    radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                    repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      #dd7bbb 0%,
                      #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                      #5a922c calc(50% / var(--repeating-conic-gradient-times)),
                      #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                      #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                    )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };

demo.tsx

"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4" />}
        title="Do things the right way"
        description="Running out of copy so I'll write anything."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4" />}
        title="The best AI code editor ever."
        description="Yes, it's true. I'm not even kidding. Ask my mom if you don't believe me."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4" />}
        title="You should buy Aceternity UI Pro"
        description="It's the best money you'll ever spend"
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4" />}
        title="This card is also built by Cursor"
        description="I'm not even kidding. Ask my mom if you don't believe me."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4" />}
        title="Coming soon on Aceternity UI"
        description="I'm writing the code as I record this, no shit."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
```

Install NPM dependencies:

```bash
motion
```

---

## 7. Animated Text — Card Stagger Mount

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
animated-text.tsx

"use client";

import { motion } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "letters" | "words";
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  initialY?: number;
  initialOpacity?: number;
  animateY?: number;
  animateOpacity?: number;
}

export default function AnimatedText({
  text,
  className = "text-4xl font-bold",
  animationType = "letters",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.05,
  initialY = 10,
  initialOpacity = 0,
  animateY = 0,
  animateOpacity = 1
}: AnimatedTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: initialY,
      opacity: initialOpacity
    },
    visible: {
      y: animateY,
      opacity: animateOpacity,
      transition: {
        duration: duration,
        ease: "easeOut"
      }
    }
  };

  const renderLetters = () => {
    return text.split("").map((char, index) => (
      <motion.span
        key={`letter-${index}`}
        variants={itemVariants}
        className="inline-block"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char}
      </motion.span>
    ));
  };

  const renderWords = () => {
    return text.split(" ").map((word, index) => (
      <motion.span key={`word-${index}`} variants={itemVariants} className="mr-2 inline-block">
        {word}
      </motion.span>
    ));
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {animationType === "letters" ? renderLetters() : renderWords()}
    </motion.div>
  );
}

demo.tsx

import AnimatedText from "@/components/ui/animated-text";

export default function Example() {
  return (
    <AnimatedText
      text="Welcome to the Future"
      className="text-4xl font-bold"
      animationType="letters"
      staggerDelay={0.08}
      duration={0.6}
    />
  );
}
```

Install NPM dependencies:

```bash
motion
```

---

## 8. Chat Bubble — Chat Messages

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
chat-bubble.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageLoading } from "@/components/ui/message-loading";

interface ChatBubbleProps {
  variant?: "sent" | "received"
  layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
}

export function ChatBubble({
  variant = "received",
  layout = "default",
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received"
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ChatBubbleMessage({
  variant = "received",
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-3",
        variant === "sent" ? "bg-primary text-primary-foreground" : "bg-muted",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

export function ChatBubbleAvatar({
  src,
  fallback = "AI",
  className,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ChatBubbleAction({
  icon,
  onClick,
  className,
}: ChatBubbleActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

export function ChatBubbleActionWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {children}
    </div>
  )
}
```

Copy-paste these files for dependencies:

```tsx
jakobhoeg/message-loading

// @hidden

function MessageLoading() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle cx="4" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}

export { MessageLoading };
```

Install NPM dependencies:

```bash
@radix-ui/react-avatar, @radix-ui/react-slot, class-variance-authority
```

---

## 9. AI Chat Input — Chat Input Bar

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
animated-ai-chat.tsx

"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"

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

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showRing && isFocused && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {props.onChange && (
          <div
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{ animation: 'none' }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const commandSuggestions: CommandSuggestion[] = [
    { icon: <ImageIcon className="w-4 h-4" />, label: "Clone UI", description: "Generate a UI from a screenshot", prefix: "/clone" },
    { icon: <Figma className="w-4 h-4" />, label: "Import Figma", description: "Import a design from Figma", prefix: "/figma" },
    { icon: <MonitorIcon className="w-4 h-4" />, label: "Create Page", description: "Generate a new web page", prefix: "/page" },
    { icon: <Sparkles className="w-4 h-4" />, label: "Improve", description: "Improve existing UI design", prefix: "/improve" },
  ];

  useEffect(() => {
    if (value.startsWith('/') && !value.includes(' ')) {
      setShowCommandPalette(true);
      const matchingSuggestionIndex = commandSuggestions.findIndex(
        (cmd) => cmd.prefix.startsWith(value)
      );
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector('[data-command-button]');
      if (commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => prev < commandSuggestions.length - 1 ? prev + 1 : 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : commandSuggestions.length - 1);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + ' ');
          setShowCommandPalette(false);
          setRecentCommand(selectedCommand.label);
          setTimeout(() => setRecentCommand(null), 3500);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) { handleSendMessage(); }
    }
  };

  const handleSendMessage = () => {
    if (value.trim()) {
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

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments(prev => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(selectedCommand.prefix + ' ');
    setShowCommandPalette(false);
    setRecentCommand(selectedCommand.label);
    setTimeout(() => setRecentCommand(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-2xl mx-auto relative">
        <motion.div
          className="relative z-10 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                How can I help today?
              </h1>
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p
              className="text-sm text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Type a command or ask a question
            </motion.p>
          </div>

          <motion.div
            className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="py-1 bg-black/95">
                    {commandSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.prefix}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                          activeSuggestion === index ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                        )}
                        onClick={() => selectCommandSuggestion(index)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center text-white/60">{suggestion.icon}</div>
                        <div className="font-medium">{suggestion.label}</div>
                        <div className="text-white/40 text-xs ml-1">{suggestion.prefix}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask a question..."
                containerClassName="w-full"
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white/90 text-sm",
                  "focus:outline-none",
                  "placeholder:text-white/20",
                  "min-h-[60px]"
                )}
                style={{ overflow: "hidden" }}
                showRing={false}
              />
            </div>

            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  className="px-4 pb-3 flex gap-2 flex-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <span>{file}</span>
                      <button onClick={() => removeAttachment(index)} className="text-white/40 hover:text-white transition-colors">
                        <XIcon className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.button type="button" onClick={handleAttachFile} whileTap={{ scale: 0.94 }} className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group">
                  <Paperclip className="w-4 h-4" />
                  <motion.span className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" layoutId="button-highlight" />
                </motion.button>
                <motion.button
                  type="button"
                  data-command-button
                  onClick={(e) => { e.stopPropagation(); setShowCommandPalette(prev => !prev); }}
                  whileTap={{ scale: 0.94 }}
                  className={cn("p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group", showCommandPalette && "bg-white/10 text-white/90")}
                >
                  <Command className="w-4 h-4" />
                  <motion.span className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" layoutId="button-highlight" />
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  value.trim() ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10" : "bg-white/[0.05] text-white/40"
                )}
              >
                {isTyping ? (
                  <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
                <span>Send</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {commandSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.prefix}
                onClick={() => selectCommandSuggestion(index)}
                className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white/60 hover:text-white/90 transition-all relative group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion.icon}
                <span>{suggestion.label}</span>
                <motion.div
                  className="absolute inset-0 border border-white/[0.05] rounded-lg"
                  initial={false}
                  animate={{ opacity: [0, 1], scale: [0.98, 1] }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="fixed bottom-8 mx-auto transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-4 py-2 shadow-lg border border-white/[0.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
                <span className="text-xs font-medium text-white/90 mb-0.5">AI</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>Thinking</span>
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {inputFocused && (
        <motion.div
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{ x: mousePosition.x - 400, y: mousePosition.y - 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
        />
      )}
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

demo.tsx

import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"

export function Demo() {
  return (
    <div className="flex w-screen overflow-x-hidden">
      <AnimatedAIChat />
    </div>
  );
}
```

Install NPM dependencies:

```bash
lucide-react, framer-motion
```

Extend existing globals.css with this code:

```css
.lab-bg::before {
  overflow: hidden;
  max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
}
```

Implementation Guidelines

1. Analyze the component structure and identify all required dependencies
2. Review the component's arguments and state
3. Identify any required context providers or hooks and install them
4. Steps to integrate:
   0. Copy paste all the code above in the correct directories
   1. Install external dependencies
   2. Fill image assets with Unsplash stock images you know exist
   3. Use lucide-react icons for svgs or logos if component requires them

---

## 10. Voice Powered Orb — AI Idle + Active State

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
voice-powered-orb.tsx

"use client";

import React, { useEffect, useRef, FC } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { cn } from "@/lib/utils";

interface VoicePoweredOrbProps {
  className?: string;
  hue?: number;
  enableVoiceControl?: boolean;
  voiceSensitivity?: number;
  maxRotationSpeed?: number;
  maxHoverIntensity?: number;
  onVoiceDetected?: (detected: boolean) => void;
}

export const VoicePoweredOrb: FC<VoicePoweredOrbProps> = ({
  className,
  hue = 0,
  enableVoiceControl = true,
  voiceSensitivity = 1.5,
  maxRotationSpeed = 1.2,
  maxHoverIntensity = 0.8,
  onVoiceDetected,
}) => {
  const ctnDom = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(dot(d0,d0), dot(d1,d1), dot(d2,d2), dot(d3,d3)), 0.0);
      vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) { return intensity / (1.0 + dist * attenuation); }
    float light2(float intensity, float attenuation, float dist) { return intensity / (1.0 + dist * dist * attenuation); }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + v1) * v2 * v3;
      col = clamp(col, 0.0, 1.0);
      return extractAlpha(col);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return 0;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = dataArrayRef.current[i] / 255;
      sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);
    const level = Math.min(rms * voiceSensitivity * 3.0, 1);
    return level;
  };

  const stopMicrophone = () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => { track.stop(); });
        mediaStreamRef.current = null;
      }
      if (microphoneRef.current) { microphoneRef.current.disconnect(); microphoneRef.current = null; }
      if (analyserRef.current) { analyserRef.current.disconnect(); analyserRef.current = null; }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      dataArrayRef.current = null;
    } catch (error) {
      console.warn('Error stopping microphone:', error);
    }
  };

  const initMicrophone = async () => {
    try {
      stopMicrophone();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, sampleRate: 44100 },
      });
      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.3;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      microphoneRef.current.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      return true;
    } catch (error) {
      console.warn("Microphone access denied or not available:", error);
      return false;
    }
  };

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    let rendererInstance: Renderer | null = null;
    let glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let rafId: number;
    let program: Program | null = null;

    try {
      rendererInstance = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: true, dpr: window.devicePixelRatio || 1 });
      glContext = rendererInstance.gl;
      glContext.clearColor(0, 0, 0, 0);
      glContext.enable(glContext.BLEND);
      glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);

      while (container.firstChild) { container.removeChild(container.firstChild); }
      container.appendChild(glContext.canvas);

      const geometry = new Triangle(glContext);
      program = new Program(glContext, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Vec3(glContext.canvas.width, glContext.canvas.height, glContext.canvas.width / glContext.canvas.height) },
          hue: { value: hue },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: 0 },
        },
      });

      const mesh = new Mesh(glContext, { geometry, program });

      const resize = () => {
        if (!container || !rendererInstance || !glContext) return;
        const dpr = window.devicePixelRatio || 1;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;
        rendererInstance.setSize(width * dpr, height * dpr);
        glContext.canvas.style.width = width + "px";
        glContext.canvas.style.height = height + "px";
        if (program) {
          program.uniforms.iResolution.value.set(glContext.canvas.width, glContext.canvas.height, glContext.canvas.width / glContext.canvas.height);
        }
      };

      window.addEventListener("resize", resize);
      resize();

      let lastTime = 0;
      let currentRot = 0;
      let voiceLevel = 0;
      const baseRotationSpeed = 0.3;
      let isMicrophoneInitialized = false;

      if (enableVoiceControl) {
        initMicrophone().then((success) => { isMicrophoneInitialized = success; });
      } else {
        stopMicrophone();
        isMicrophoneInitialized = false;
      }

      const update = (t: number) => {
        rafId = requestAnimationFrame(update);
        if (!program) return;
        const dt = (t - lastTime) * 0.001;
        lastTime = t;
        program.uniforms.iTime.value = t * 0.001;
        program.uniforms.hue.value = hue;

        if (enableVoiceControl && isMicrophoneInitialized) {
          voiceLevel = analyzeAudio();
          if (onVoiceDetected) { onVoiceDetected(voiceLevel > 0.1); }
          const voiceRotationSpeed = baseRotationSpeed + (voiceLevel * maxRotationSpeed * 2.0);
          if (voiceLevel > 0.05) { currentRot += dt * voiceRotationSpeed; }
          program.uniforms.hover.value = Math.min(voiceLevel * 2.0, 1.0);
          program.uniforms.hoverIntensity.value = Math.min(voiceLevel * maxHoverIntensity * 0.8, maxHoverIntensity);
        } else {
          program.uniforms.hover.value = 0;
          program.uniforms.hoverIntensity.value = 0;
          if (onVoiceDetected) { onVoiceDetected(false); }
        }

        program.uniforms.rot.value = currentRot;

        if (rendererInstance && glContext) {
          glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
          rendererInstance.render({ scene: mesh });
        }
      };

      rafId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        if (container && glContext && glContext.canvas) {
          try {
            if (container.contains(glContext.canvas)) { container.removeChild(glContext.canvas); }
          } catch (error) { console.warn("Canvas cleanup error:", error); }
        }
        stopMicrophone();
        if (glContext) { glContext.getExtension("WEBGL_lose_context")?.loseContext(); }
      };
    } catch (error) {
      console.error("Error initializing Voice Powered Orb:", error);
      if (container && container.firstChild) { container.removeChild(container.firstChild); }
      return () => { window.removeEventListener("resize", () => {}); };
    }
  }, [hue, enableVoiceControl, voiceSensitivity, maxRotationSpeed, maxHoverIntensity, vert, frag]);

  useEffect(() => {
    let isMounted = true;
    const handleMicrophoneState = async () => {
      if (enableVoiceControl) {
        const success = await initMicrophone();
        if (!isMounted) return;
      } else {
        stopMicrophone();
      }
    };
    handleMicrophoneState();
    return () => { isMounted = false; };
  }, [enableVoiceControl]);

  return (
    <div
      ref={ctnDom}
      className={cn("w-full h-full relative", className)}
    />
  );
};

demo.tsx

"use client";

import React, { useState } from "react";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function VoicePoweredOrbPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);

  const toggleRecording = () => { setIsRecording(!isRecording); };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-96 h-96 relative">
          <VoicePoweredOrb
            enableVoiceControl={isRecording}
            className="rounded-xl overflow-hidden shadow-2xl"
            onVoiceDetected={setVoiceDetected}
          />
        </div>
        <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"} size="lg" className="px-8 py-3">
          {isRecording ? (
            <><MicOff className="w-5 h-5 mr-3" />Stop Recording</>
          ) : (
            <><Mic className="w-5 h-5 mr-3" />Start Recording</>
          )}
        </Button>
        <p className="text-muted-foreground text-center max-w-md">
          Click the button to enable voice control. Speak to see the orb respond to your voice with subtle movements.
        </p>
      </div>
    </div>
  );
}
```

Install NPM dependencies:

```bash
ogl, @radix-ui/react-slot, class-variance-authority
```

---

## 11. Profile Card — Persona Select Screen

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx
profile-card.tsx

"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check, Users, UserCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  name?: string
  description?: string
  image?: string
  isVerified?: boolean
  followers?: number
  following?: number
  enableAnimations?: boolean
  className?: string
  onFollow?: () => void
  isFollowing?: boolean
}

export function ProfileCard({
  name = "Sophie Bennett",
  description = "Product Designer who focuses on simplicity & usability.",
  image = "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&h=800&fit=crop&auto=format&q=80",
  isVerified = true,
  followers = 312,
  following = 48,
  enableAnimations = true,
  className,
  onFollow = () => {},
  isFollowing = false,
}: ProfileCardProps) {
  const [hovered, setHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion

  const containerVariants = {
    rest: { scale: 1, y: 0, filter: "blur(0px)" },
    hover: shouldAnimate ? {
      scale: 1.02,
      y: -4,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 }
    } : {},
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6, staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(2px)" },
    visible: {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1, scale: 1,
      transition: { type: "spring", damping: 8, stiffness: 200, mass: 0.8 },
    },
  }

  return (
    <motion.div
      data-slot="profile-hover-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-80 h-96 rounded-3xl border border-border/20 text-card-foreground overflow-hidden shadow-xl shadow-black/5 cursor-pointer group backdrop-blur-sm",
        "dark:shadow-black/20",
        className
      )}
    >
      {/* Full Cover Image */}
      <motion.img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        variants={imageVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 via-background/20 via-background/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background/90 via-background/60 via-background/30 via-background/15 via-background/8 to-transparent backdrop-blur-[1px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/85 via-background/40 to-transparent backdrop-blur-sm" />

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 p-6 space-y-4"
      >
        {/* Name and Verification */}
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <motion.h2
            className="text-2xl font-bold text-foreground"
            variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
          >
            {name.split("").map((letter, index) => (
              <motion.span key={index} variants={letterVariants} className="inline-block">
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h2>
          {isVerified && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white"
              whileHover={{ scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            >
              <Check className="w-2.5 h-2.5" />
            </motion.div>
          )}
        </motion.div>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </motion.p>

        {/* Stats */}
        <motion.div variants={itemVariants} className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-foreground">{followers}</span>
            <span className="text-sm">followers</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="w-4 h-4" />
            <span className="font-semibold text-foreground">{following}</span>
            <span className="text-sm">following</span>
          </div>
        </motion.div>

        {/* Follow Button */}
        <motion.button
          variants={itemVariants}
          onClick={onFollow}
          whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full cursor-pointer py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200",
            "border border-border/20 shadow-sm",
            isFollowing ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-foreground text-background hover:bg-foreground/90",
            "transform-gpu"
          )}
        >
          {isFollowing ? "Following" : "Follow +"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

demo.tsx

"use client"

import { ProfileCard } from "@/components/ui/profile-card"

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-background flex items-center justify-center">
      <ProfileCard />
    </div>
  )
}
```

Install NPM dependencies:

```bash
lucide-react, framer-motion
```

---

## Usage Notes for This App

**Voice Powered Orb in Chat Screen:**
- `enableVoiceControl={false}` when AI is idle — orb breathes slowly by default
- Trigger a visual "active" state by controlling the orb's props when `isLoading === true`
- The orb does NOT need microphone in this app — use it purely as a visual state indicator

**Profile Card on Persona Select:**
- Pass fake follower/following data from the persona data table in CLAUDE.md
- Use Unsplash portrait images for each persona's profile photo
- The `onFollow` button triggers navigation into the chat screen for that persona

**Chat Bubble + Message List:**
- Client messages: `variant="received"` — left side
- User messages: `variant="sent"` — right side
- Use `isLoading={true}` on a ChatBubbleMessage while waiting for API response
