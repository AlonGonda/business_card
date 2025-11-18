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
    <div className="perspective-1000 business-card-container w-full h-full max-w-full mx-auto flex items-center justify-center relative">
      {/* Single Flip Button - Always visible */}
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-primary-600/90 hover:bg-primary-500 active:bg-primary-700 border-2 border-primary-400/50 shadow-lg transition-all z-20 flex items-center gap-2 group touch-manipulation"
        aria-label="Flip card"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <FaSync className="w-4 h-4 text-white group-hover:rotate-180 group-active:rotate-180 transition-transform duration-300" />
        <span className="text-white text-sm font-medium">Flip</span>
      </button>

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
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden card-base card-padding">

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto rounded-full overflow-hidden border-4 border-primary-500/50 shadow-2xl flex-shrink-0 ring-4 ring-primary-500/20 card-image mb-4"
            >
              <Image
                src="/professional-portrait.jpg"
                alt={contact.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 136px, (max-width: 1024px) 160px, 192px"
                priority
              />
            </motion.div>

            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center flex-shrink-0 mb-4 px-2"
            >
              <h1 className="card-h1 font-bold text-white mb-2 bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent break-words">
                {contact.name}
              </h1>
              <div className="flex items-center justify-center text-primary-300 flex-wrap gap-1 mb-2">
                <FaMusic className="w-[1em] h-[1em] animate-pulse flex-shrink-0" />
                <p className="card-title font-semibold break-words">{contact.title}</p>
                <FaMusic className="w-[1em] h-[1em] animate-pulse flex-shrink-0" />
              </div>
              <p className="card-tagline text-gray-300 font-medium break-words px-1">🎷 Making Every Moment Musical 🎷</p>
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
              className="card-hint text-center text-primary-300/80 flex-shrink-0 font-medium w-full mt-2 px-1 break-words"
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
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700/50 h-full max-h-full flex flex-col overflow-hidden card-base card-padding">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center flex-shrink-0 mb-4 px-2"
            >
              <h2 className="card-h1 font-bold text-white mb-2 bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent break-words">
                {contact.name}
              </h2>
              <div className="flex items-center justify-center text-primary-300 flex-wrap gap-1 mb-2">
                <FaMusic className="w-[1em] h-[1em] animate-pulse flex-shrink-0" />
                <p className="card-title font-semibold break-words">{contact.title}</p>
                <FaMusic className="w-[1em] h-[1em] animate-pulse flex-shrink-0" />
              </div>
            </motion.div>

            {/* Services Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col justify-center min-h-0 mb-4 px-2"
            >
              <div className="bg-gradient-to-br from-primary-950/40 to-accent-950/40 border-2 border-primary-500/30 shadow-lg w-full max-w-full h-full flex flex-col justify-center rounded-xl card-gap card-padding">
                <h3 className="card-services-title text-primary-300 font-bold flex items-center justify-center flex-wrap flex-shrink-0 gap-2">
                  <span>🎼</span>
                  <span className="break-words">What I Do</span>
                  <span>🎼</span>
                </h3>
                <div className="text-gray-200 leading-relaxed font-medium w-full flex-1 flex flex-col justify-center card-gap">
                  <div className="card-services-text text-primary-300/90 font-semibold w-full text-center flex-shrink-0 px-2 break-words">
                    🎉 Weddings • 🏢 Corporate Events • 🎪 Private Parties • 🎭 Special Occasions
                  </div>
                  <p className="card-description break-words flex-shrink-0 text-center px-2">
                    Every performance is a masterpiece, crafted with passion, precision, and pure musical magic! Whether you're planning an intimate gathering or a grand celebration, I bring the soulful sound of the saxophone to make your event truly unforgettable.
                  </p>
                  <div className="card-services-cta text-primary-300/90 font-semibold italic w-full text-center flex-shrink-0 mt-1 px-2 break-words">
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
