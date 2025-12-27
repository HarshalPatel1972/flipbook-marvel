'use client';

import { motion } from 'framer-motion';
import IntroLoader from './components/IntroLoader';

// Define locally to ensure no import issues
const IMAGE_URLS = Array.from({ length: 15 }, (_, i) => 
  `https://loremflickr.com/1920/1080/anime,comic?random=${i}`
);

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-500 selection:text-white overflow-hidden relative">
      <IntroLoader />

      {/* Scattered Image Gallery (Revealed after Loader Fades) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none h-screen">
        <div className="relative w-full h-full max-w-[1600px] mx-auto">
           {IMAGE_URLS.map((src, i) => {
              // Deterministic random positioning for stability
              const randomX = (i * 12345) % 90; // 0-90%
              const randomY = (i * 67890) % 80; // 0-80%
              const rotate = ((i * 34567) % 30) - 15; // -15 to 15 deg

              return (
                <motion.div
                    key={src}
                    className="absolute w-44 h-28 md:w-64 md:h-40 bg-neutral-800 border-4 border-white/5 shadow-2xl overflow-hidden cursor-pointer pointer-events-auto hover:z-[60] hover:scale-150 transition-all duration-500 ease-out"
                    style={{
                        left: `${(i % 5) * 20 + (Math.random() * 10 - 5)}%`, 
                        top: `${Math.floor(i / 5) * 25 + (Math.random() * 10 - 5)}%`,
                        rotate: `${rotate}deg`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 8.5 + (i * 0.1), duration: 0.8 }} 
                >
                    <img 
                        src={src} 
                        alt="Anime Art" 
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </motion.div>
              );
           })}
        </div>
      </div>

        {/* Branding Footer/Hero Overlay */}
        <div className="absolute bottom-10 left-0 right-0 z-10 text-center pointer-events-none">
             <p className="text-neutral-500 text-sm tracking-widest uppercase mb-2">Creative Developer</p>
             <h2 className="text-white font-black text-2xl tracking-tight">HARSHAL PATEL</h2>
        </div>
    </main>
  );
}
