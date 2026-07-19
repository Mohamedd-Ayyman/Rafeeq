"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useNotification } from "@/context/NotificationContext";

const styles = {
  info: "border-emerald-400/40 bg-emerald-500/15",
  success: "border-teal-400/40 bg-teal-500/15",
  warning: "border-amber-400/40 bg-amber-500/15",
  error: "border-red-400/40 bg-red-500/15",
};

export default function NotificationToast() {
  const { toasts } = useNotification();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className={`glass rounded-xl px-4 py-3 border ${styles[t.type] || styles.info}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
