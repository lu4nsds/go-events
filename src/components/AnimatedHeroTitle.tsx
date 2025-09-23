"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedHeroTitle() {
  // Palavras relacionadas a corrida que serão mostradas em sequência
  const runningWords = [
    "Incríveis",
    "Esportivos",
    "de Corrida",
    "Fitness",
    "Saudáveis",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Efeito para alternar entre as palavras
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === runningWords.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Troca a cada 3 segundos

    return () => clearInterval(interval);
  }, [runningWords.length]);

  return (
    <div className="text-center mb-5">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Descubra Eventos
        <div className="relative h-20 md:h-24 lg:h-28 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent absolute w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {runningWords[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </h1>
      <motion.div
        className="w-40 h-2 bg-gradient-to-r from-violet-600 to-indigo-600 mx-auto rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: 160,
          transition: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
          },
        }}
      />
    </div>
  );
}
