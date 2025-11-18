'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ContactInfo } from '@/lib/vcard'
import { generateVCard } from '@/lib/vcard'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'

interface QRCodeProps {
  contact: ContactInfo
  size?: number
}

export default function QRCode({ contact, size = 200 }: QRCodeProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrSize, setQrSize] = useState(size)
  const containerRef = useRef<HTMLDivElement>(null)
  const vcardData = generateVCard(contact)
  
  // Make QR code responsive to container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        // QR code should be about 40% of container width, with min/max constraints
        const calculatedSize = containerWidth * 0.4
        const newSize = Math.min(Math.max(calculatedSize, 140), 200)
        setQrSize(Math.round(newSize))
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    const resizeObserver = new ResizeObserver(updateSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => {
      window.removeEventListener('resize', updateSize)
      resizeObserver.disconnect()
    }
  }, [])

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
    <div ref={containerRef} className="flex flex-col items-center gap-2 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-2 bg-white rounded-lg shadow-lg"
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
        className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
      >
        <FaDownload className="w-4 h-4" />
        <span>Save Contact</span>
      </motion.button>
    </div>
  )
}
