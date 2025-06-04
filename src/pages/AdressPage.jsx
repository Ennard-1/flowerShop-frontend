import React from 'react';
import { motion } from 'framer-motion';

const AdressPage = () => {
  const adress = import.meta.env.VITE_ADRESS
  const googleMapsAdress= import.meta.env.VITE_GOOGLE_MAPS_ADRESS
  return (
    <div className="min-h-screen pt-4 pb-8 px-4 max-w-screen-sm mx-auto space-y-6">
      {/* Endereço escrito */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-2">Nosso Endereço</h1>
        <p className="text-base text-gray-700 leading-relaxed">
          {adress}
        </p>
      </motion.div>

      {/* Imagem da frente da loja */}
      <motion.div
        className="rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/streetPicture.jpg"
          alt="Frente da loja"
          className="w-full aspect-video object-cover"
        />
      </motion.div>

      {/* Card com embed do Google Maps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.01] transition-transform"
      >
        <iframe
          src={googleMapsAdress}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        ></iframe>
      </motion.div>
    </div>
  );
};

export default AdressPage;
