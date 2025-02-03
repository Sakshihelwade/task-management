import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-3xl font-bold text-center text-gray-800 mb-6" variants={itemVariants}>
          Contact Us
        </motion.h1>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-blue-500 text-xl" />
            <span className="text-gray-700">contact@example.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-green-500 text-xl" />
            <span className="text-gray-700">+123 456 7890</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-red-500 text-xl" />
            <span className="text-gray-700">1234 Street, City, Country</span>
          </div>
        </motion.div>

        <motion.form className="mt-6 space-y-4" variants={itemVariants}>
          <Input placeholder="Your Name" className="p-3 border rounded-lg w-full" />
          <Input placeholder="Your Email" className="p-3 border rounded-lg w-full" />
          <Textarea placeholder="Your Message" className="p-3 border rounded-lg w-full h-32" />
          <Button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Send Message
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Contact;
