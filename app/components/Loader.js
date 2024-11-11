import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </div>
  );
}