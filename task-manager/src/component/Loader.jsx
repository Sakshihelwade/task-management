import React from "react";
import { motion } from "framer-motion";

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      className="fixed inset-0"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="flex items-center justify-center z-50 h-full">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default Loader;
