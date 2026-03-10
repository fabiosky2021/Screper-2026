import React from 'react';

export default function FuturisticAvatar() {
  return (
    <div className="relative w-full h-80 overflow-hidden bg-black rounded-3xl border border-zinc-800 shadow-2xl">
      {/* Metallic AI Face Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a2a3a_0%,#000000_80%)]" />
      
      {/* Metallic Face Simulation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full bg-[url('https://picsum.photos/seed/metallic-ai-face/800/600')] bg-cover bg-center opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Code Overlay (Simulating the code in the image) */}
      <div className="absolute inset-0 p-6 font-mono text-[10px] text-emerald-500/40 overflow-hidden pointer-events-none">
        <div className="animate-scroll-up">
          {Array.from({ length: 40 }).map((_, i) => (
            <p key={i} className="leading-tight">
              &gt; SYSTEM_CORE_2026_NEURAL_LINK_{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          ))}
        </div>
      </div>
      
      {/* Futuristic UI Elements */}
      <div className="absolute top-4 right-4 text-emerald-500 font-mono text-xs tracking-widest uppercase animate-pulse">
        Neural_Link: Active
      </div>
      
      <div className="absolute bottom-4 left-4 text-zinc-300 font-mono text-xs tracking-widest uppercase">
        Gemini_2026 // Metallic_Intelligence
      </div>
    </div>
  );
}
