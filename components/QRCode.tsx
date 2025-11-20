'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ContactInfo } from '@/lib/vcard'
import { generateVCard } from '@/lib/vcard'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDownload, FaCopy, FaPhone, FaEnvelope, FaTimes, FaCheck } from 'react-icons/fa'

interface QRCodeProps {
  contact: ContactInfo
  size?: number
}

export default function QRCode({ contact, size = 200 }: QRCodeProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [isEmbeddedBrowser, setIsEmbeddedBrowser] = useState(false)
  const [qrSize, setQrSize] = useState(size)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const vcardData = generateVCard(contact)
  
  // Ensure we're mounted before rendering portal (SSR safety)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Detect if we're in an embedded browser (Instagram, Facebook, etc.)
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isInstagram = /Instagram/i.test(userAgent)
    const isFacebook = /FBAN|FBAV/i.test(userAgent)
    const isTwitter = /Twitter/i.test(userAgent)
    const isLinkedIn = /LinkedInApp/i.test(userAgent)
    const isInAppBrowser = isInstagram || isFacebook || isTwitter || isLinkedIn
    
    // Also check if we're in a WebView
    const isWebView = /wv|WebView/i.test(userAgent)
    
    setIsEmbeddedBrowser(isInAppBrowser || isWebView)
  }, [])
  
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

  const handleDownload = async () => {
    // For embedded browsers, show fallback menu immediately since downloads often don't work
    if (isEmbeddedBrowser) {
      setShowFallback(true)
      return
    }
    
    setIsDownloading(true)
    setShowFallback(false)
    
    const apiUrl = '/api/vcard'
    const filename = `${contact.name.replace(/\s+/g, '_')}.vcf`
    
    try {
      // For regular browsers, use standard link download
      const link = document.createElement('a')
      link.href = apiUrl
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      document.body.removeChild(link)
      setIsDownloading(false)
    } catch (error) {
      console.error('Download failed:', error)
      setIsDownloading(false)
      setShowFallback(true)
    }
  }

  const handleCopyVCard = async () => {
    try {
      const phoneNumber = contact.phone
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneNumber)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowFallback(false)
        }, 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = phoneNumber
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowFallback(false)
        }, 2000)
      }
    } catch (err) {
      // If copy fails, show the phone number in an alert
      alert(`Please copy this phone number:\n\n${contact.phone}`)
    }
  }

  return (
    <>
      <div ref={containerRef} className="flex flex-col items-center gap-2 w-full" style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-white rounded-lg shadow-lg"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          }}
        >
          <QRCodeSVG
            value={vcardData}
            size={Math.round(qrSize)}
            level="H"
            includeMargin={true}
          />
        </motion.div>
        <div className="relative w-full" style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}>
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              isolation: 'isolate',
            }}
          >
            <FaDownload className="w-4 h-4" />
            <span>{isDownloading ? 'Saving...' : 'Save Contact'}</span>
          </motion.button>
        </div>
      </div>

      {/* Modal rendered via portal to document.body for proper centering */}
      {mounted && createPortal(
        <AnimatePresence>
          {showFallback && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowFallback(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              
              {/* Modal - Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                transition={{ duration: 0.2 }}
                className="fixed z-[9999] w-[90%] max-w-md p-4 sm:p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  margin: 0,
                  pointerEvents: 'auto',
                }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Save Contact</h3>
                  <button
                    onClick={() => setShowFallback(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Close"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              
              <p className="text-xs text-gray-300 mb-3">
                {isEmbeddedBrowser 
                  ? 'Instagram browser doesn\'t support direct downloads. Choose an option:'
                  : 'Choose an option to save this contact:'}
              </p>

              <div className="space-y-2">
                <motion.button
                  onClick={handleCopyVCard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <FaCheck className="w-4 h-4" />
                      <span>Phone Number Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="w-4 h-4" />
                      <span>Copy Phone Number</span>
                    </>
                  )}
                </motion.button>

                {isEmbeddedBrowser && (
                  <motion.a
                    href="/api/vcard"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Try Download Link</span>
                  </motion.a>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <motion.a
                    href={`tel:${contact.phone}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-xs"
                  >
                    <FaPhone className="w-3 h-3" />
                    <span>Call</span>
                  </motion.a>
                  <motion.a
                    href={`mailto:${contact.email}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-xs"
                  >
                    <FaEnvelope className="w-3 h-3" />
                    <span>Email</span>
                  </motion.a>
                </div>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
