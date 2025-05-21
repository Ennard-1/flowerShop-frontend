import React from 'react';
import { motion } from 'framer-motion';
import { SiInstagram, SiWhatsapp } from '@icons-pack/react-simple-icons';

const ContactPage = () => {
    const instagramAdress = import.meta.env.VITE_INSTAGRAM_ADRESS
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Nossas redes</h1>

            {/* WhatsApp Card */}
            <motion.a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden shadow-lg bg-green-500 hover:scale-105 transition-transform block"
            >
                <div className="flex items-center p-5">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden">
                        <img
                            src="./src/assets/whatsappProfilePicture.jpg"
                            alt="WhatsApp profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-4 text-white">
                        <p className="text-xl font-semibold">Loja no WhatsApp</p>
                        <p className="text-sm opacity-90">Clique para falar conosco</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 backdrop-blur-sm bg-white/20 p-2 rounded-full">
                    <SiWhatsapp className="text-white w-6 h-6" />
                </div>
            </motion.a>

            {/* Instagram Card */}
            <motion.a
                href={`https://www.instagram.com/${instagramAdress}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:scale-105 transition-transform block"
            >
                <div className="flex items-center p-5">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden">
                        <img
                            src="./src/assets/instagramProfilePicture.jpg"
                            alt="Instagram profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-4 text-white">
                        <p className="text-sm font-bold">@{instagramAdress}</p>
                        <p className="text-sm opacity-90">Acompanhe nossas novidades</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 backdrop-blur-sm bg-white/20 p-2 rounded-full">
                    <SiInstagram className="text-white w-6 h-6" />
                </div>
            </motion.a>

            {/* Telefone */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-5 rounded-2xl shadow-lg text-center hover:scale-105 transition-transform"
            >
                <p className="text-xl font-semibold text-gray-800">Telefone</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{whatsappNumber}</p>
            </motion.div>
        </div>
    );
};

export default ContactPage;
