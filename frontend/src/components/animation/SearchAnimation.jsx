import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchAnimation() {
  const searchTerms = [
    '"laptop"',
    '"mobile"',
    '"headphones"',
    '"t-shirt"',
    '"shoes"',
    '"books"',
    '"watches"',
    '"camera"',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % searchTerms.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="items-center space-x-2 text-[#454d5c] overflow-hidden inline-block whitespace-nowrap text-ellipsis">
      <span>Search for</span>

      <AnimatePresence mode="wait">
        <motion.span
          key={searchTerms[index]}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {searchTerms[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}