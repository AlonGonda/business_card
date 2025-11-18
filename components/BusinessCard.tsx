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
    <div className="perspective-1000 business-card-container w-full h-full max-w-full mx-auto flex items-center justify-center" style={{ fontSize: 'clamp(14px, 3vw, 20px)' }}>
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
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden" style={{ fontSize: 'clamp(14px, 3vw, 20px)' }}>
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
              className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full overflow-hidden border-4 border-primary-500/50 shadow-2xl flex-shrink-0 ring-4 ring-primary-500/20"
            >
              <Image
                src="/professional-portrait.jpg"
                alt={contact.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, (max-width: 1024px) 224px, 256px"
                priority
              />
            </motion.div>

            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-4 sm:mb-5 md:mb-6 flex-shrink-0 px-2"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent break-words leading-tight">
                {contact.name}
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-primary-300 mb-2 flex-wrap">
                <FaMusic className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold break-words">{contact.title}</p>
                <FaMusic className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
              </div>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium break-words px-1">🎷 Making Every Moment Musical 🎷</p>
            </motion.div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex items-center justify-center min-h-0 overflow-hidden"
            >
              <QRCode contact={contact} size={180} />
            </motion.div>

            {/* Hint Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="single-line-text text-center text-primary-300/80 mt-2 sm:mt-3 md:mt-4 flex-shrink-0 font-medium whitespace-nowrap px-0.5 sm:px-1 md:px-2 w-full overflow-hidden"
            >
              📱 Scan to save my contact & let's make music together! 🎵
            </motion.div>
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
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden" style={{ fontSize: 'clamp(14px, 3vw, 20px)' }}>
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
              className="text-center mb-4 sm:mb-5 md:mb-6 flex-shrink-0 px-2"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent break-words leading-tight">
                {contact.name}
              </h2>
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-primary-300 mb-2 flex-wrap">
                <FaMusic className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold break-words">{contact.title}</p>
                <FaMusic className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" />
              </div>
            </motion.div>

            {/* Services Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col justify-center min-h-0 mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0"
            >
              <div className="bg-gradient-to-br from-primary-950/40 to-accent-950/40 border-2 border-primary-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 shadow-lg overflow-hidden w-full max-w-full h-full flex flex-col justify-center gap-3 sm:gap-4 md:gap-5">
                <h3 className="text-primary-300 font-bold text-base sm:text-lg md:text-xl lg:text-2xl flex items-center justify-center gap-2 sm:gap-3 flex-wrap flex-shrink-0">
                  <span className="text-lg sm:text-xl md:text-2xl">🎼</span>
                  <span className="break-words">What I Do</span>
                  <span className="text-lg sm:text-xl md:text-2xl">🎼</span>
                </h3>
                <div className="text-gray-200 leading-relaxed font-medium space-y-3 sm:space-y-4 md:space-y-5 w-full overflow-hidden flex-1 flex flex-col justify-center">
                  <div 
                    className="text-primary-300/90 font-semibold px-2 sm:px-3 w-full text-center overflow-hidden flex-shrink-0"
                    style={{ 
                      fontSize: '1em',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    🎉 Weddings • 🏢 Corporate Events • 🎪 Private Parties • 🎭 Special Occasions
                  </div>
                  <p className="break-words flex-shrink-0 text-center px-2 sm:px-3" style={{ fontSize: '0.95em', lineHeight: '1.6' }}>
                    Every performance is a masterpiece, crafted with passion, precision, and pure musical magic! Whether you're planning an intimate gathering or a grand celebration, I bring the soulful sound of the saxophone to make your event truly unforgettable.
                  </p>
                  <div 
                    className="single-line-text text-primary-300/90 font-semibold italic whitespace-nowrap px-2 sm:px-3 w-full text-center overflow-hidden flex-shrink-0 mt-1 sm:mt-2"
                  >
                    ✨ Let's make some beautiful music together! 🎷✨
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-shrink-0"
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

