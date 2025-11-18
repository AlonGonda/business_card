'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import QRCode from './QRCode'
import ContactButtons from './ContactButtons'
import { ContactInfo } from '@/lib/vcard'
import { FaMusic, FaSync } from 'react-icons/fa'

interface BusinessCardProps {
  contact: ContactInfo
  whatsappUrl: string
  instagramUrl: string
  services: string
}

export default function BusinessCard({ contact, whatsappUrl, instagramUrl, services }: BusinessCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full h-full max-w-md mx-auto flex items-center justify-center">
      <motion.div
        className="relative w-full h-full max-h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <motion.div
          className="absolute inset-0 backface-hidden w-full h-full"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden">
            {/* Flip Button */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
              aria-label="Flip card"
            >
              <FaSync className="w-4 h-4 text-gray-400" />
            </button>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full overflow-hidden border-4 border-primary-500/30 shadow-lg flex-shrink-0"
            >
              <Image
                src="/professional-portrait.jpg"
                alt={contact.name}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </motion.div>

            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-1 sm:mb-2">{contact.name}</h1>
              <div className="flex items-center justify-center gap-2 text-primary-300 mb-1">
                <FaMusic className="w-3 h-3 sm:w-4 sm:h-4" />
                <p className="text-sm sm:text-base md:text-lg font-medium">{contact.title}</p>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">{contact.organization}</p>
            </motion.div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex items-center justify-center min-h-0 overflow-hidden"
            >
              <QRCode contact={contact} size={140} />
            </motion.div>

            {/* Hint Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-500 text-xs mt-2 sm:mt-3 md:mt-4 flex-shrink-0"
            >
              Scan to save contact
            </motion.p>
          </div>
        </motion.div>

        {/* Back of Card */}
        <motion.div
          className="absolute inset-0 backface-hidden w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden">
            {/* Flip Button */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
              aria-label="Flip card"
            >
              <FaSync className="w-4 h-4 text-gray-400" />
            </button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0"
            >
              <h2 className="text-xl sm:text-2xl font-light text-white mb-1 sm:mb-2">{contact.name}</h2>
              <p className="text-primary-300 font-medium text-sm sm:text-base">{contact.title}</p>
            </motion.div>

            {/* Services Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 sm:mb-4 md:mb-6 flex-shrink-0"
            >
              <div className="bg-primary-950/30 border border-primary-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <h3 className="text-primary-300 font-medium mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">Services</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">{services}</p>
              </div>
            </motion.div>

            {/* Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 min-h-0 overflow-y-auto"
            >
              <ContactButtons
                contact={contact}
                whatsappUrl={whatsappUrl}
                instagramUrl={instagramUrl}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

