'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ContactInfo } from '@/lib/vcard'
import { generateVCard } from '@/lib/vcard'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'

interface QRCodeProps {
  contact: ContactInfo
  size?: number
}

export default function QRCode({ contact, size = 200 }: QRCodeProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrSize, setQrSize] = useState(size)
  const vcardData = generateVCard(contact)
  
  // Make QR code responsive
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = window.innerWidth * 0.35
      const maxHeight = window.innerHeight * 0.25
      const newSize = Math.min(size, maxWidth, maxHeight, 180)
      setQrSize(Math.max(Math.round(newSize), 100)) // Minimum 100px
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [size])

  const handleDownload = () => {
    setIsDownloading(true)
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = `${contact.name.replace(/\s+/g, '_')}.vcf`
    link.download = filename
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setTimeout(() => setIsDownloading(false), 500)
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-2 sm:p-3 md:p-4 bg-white rounded-lg sm:rounded-xl shadow-lg"
      >
        <QRCodeSVG
          value={vcardData}
          size={Math.round(qrSize)}
          level="H"
          includeMargin={true}
        />
      </motion.div>
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-xs sm:text-sm"
      >
        <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Save Contact</span>
      </motion.button>
    </div>
  )
}

