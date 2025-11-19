'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ContactInfo } from '@/lib/vcard'
import { generateVCard } from '@/lib/vcard'
import { useState, useEffect, useRef } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const vcardData = generateVCard(contact)
  
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
    setIsDownloading(true)
    setShowFallback(false)
    
    const filename = `${contact.name.replace(/\s+/g, '_')}.vcf`
    let downloadSuccess = false
    
    try {
      // Method 1: Try standard download with blob URL
      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.setAttribute('download', filename)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      // Wait a bit to see if download started
      await new Promise(resolve => setTimeout(resolve, 300))
      
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      downloadSuccess = true
    } catch (error) {
      console.log('Method 1 failed, trying method 2...')
    }
    
    // Method 2: Try data URI with window.open (works in many embedded browsers)
    if (!downloadSuccess) {
      try {
        const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`
        const link = document.createElement('a')
        link.href = dataUri
        link.download = filename
        link.setAttribute('download', filename)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        await new Promise(resolve => setTimeout(resolve, 300))
        downloadSuccess = true
      } catch (error) {
        console.log('Method 2 failed, trying method 3...')
      }
    }
    
    // Method 3: Try opening data URI in new window/tab (for embedded browsers)
    if (!downloadSuccess && isEmbeddedBrowser) {
      try {
        const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`
        const newWindow = window.open(dataUri, '_blank')
        if (newWindow) {
          // Give it time to open, then close
          setTimeout(() => {
            try {
              newWindow.close()
            } catch (e) {
              // Ignore close errors
            }
          }, 1000)
          downloadSuccess = true
        }
      } catch (error) {
        console.log('Method 3 failed, trying method 4...')
      }
    }
    
    // Method 4: Try creating a temporary link with target="_blank" and download attribute
    if (!downloadSuccess) {
      try {
        const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.position = 'absolute'
        link.style.left = '-9999px'
        document.body.appendChild(link)
        
        // Trigger click with a slight delay
        setTimeout(() => {
          link.click()
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 100)
        }, 50)
        
        await new Promise(resolve => setTimeout(resolve, 500))
        downloadSuccess = true
      } catch (error) {
        console.log('Method 4 failed')
      }
    }
    
    setIsDownloading(false)
    
    // Only show fallback if all methods failed
    if (!downloadSuccess) {
      setShowFallback(true)
    }
  }

  const handleCopyVCard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(vcardData)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowFallback(false)
        }, 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = vcardData
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
      // If copy fails, show the vCard data in an alert
      alert(`Please copy this contact data:\n\n${vcardData}`)
    }
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
      <div className="relative w-full">
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
        >
          <FaDownload className="w-4 h-4" />
          <span>{isDownloading ? 'Saving...' : 'Save Contact'}</span>
        </motion.button>

        <AnimatePresence>
          {showFallback && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Save Contact</h3>
                <button
                  onClick={() => setShowFallback(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-gray-300 mb-3">
                Choose an option to save this contact:
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
                      <span>Copied! Paste in Contacts app</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="w-4 h-4" />
                      <span>Copy Contact Data</span>
                    </>
                  )}
                </motion.button>

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
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
