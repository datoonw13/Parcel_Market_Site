"use client";

import { AnimatePresence, motion } from "framer-motion";

const ListItemContent = () => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.1, ease: "linear" }}
    >
      <div className="lg:border-b">
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
        <p>qwdwqd</p>
      </div>
    </motion.div>
  </AnimatePresence>
);

export default ListItemContent;
