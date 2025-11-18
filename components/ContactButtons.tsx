'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaPhone, FaEnvelope, FaWhatsapp, FaInstagram, FaShareAlt, FaTimes } from 'react-icons/fa'
import { ContactInfo } from '@/lib/vcard'
import { downloadVCard } from '@/lib/vcard'
import { useState, useEffect, useRef } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from 'react-share'

interface ContactButtonsProps {
  contact: ContactInfo
  whatsappUrl: string
  instagramUrl: string
}

export default function ContactButtons({ contact, whatsappUrl, instagramUrl }: ContactButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `${contact.name} - ${contact.title}`
  const shareDescription = `Contact ${contact.name} - ${contact.title}`

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showShareMenu])

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowShareMenu(false)
        }, 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowShareMenu(false)
        }, 2000)
      }
    } catch (err) {
      alert(`Please copy this URL:\n${shareUrl}`)
    }
  }

  const handleSaveContact = () => {
    downloadVCard(contact, `${contact.name.replace(/\s+/g, '_')}.vcf`)
  }

  const buttons = [
    {
      icon: FaPhone,
      label: 'Call',
      href: `tel:${contact.phone}`,
      color: 'primary',
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      href: `mailto:${contact.email}`,
      color: 'primary',
    },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      href: whatsappUrl,
      color: 'accent',
      external: true,
    },
    {
      icon: FaInstagram,
      label: 'Instagram',
      href: instagramUrl,
      color: 'accent',
      external: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {buttons.map((button, index) => {
          const Icon = button.icon
          return (
            <motion.a
              key={index}
              href={button.href}
              target={button.external ? '_blank' : undefined}
              rel={button.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-all ${
                button.color === 'primary'
                  ? 'border-primary-500/30 bg-primary-950/30 hover:border-primary-500/50 hover:bg-primary-950/50 text-primary-300'
                  : 'border-accent-500/30 bg-accent-950/30 hover:border-accent-500/50 hover:bg-accent-950/50 text-accent-300'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm break-words text-center">{button.label}</span>
            </motion.a>
          )
        })}
      </div>

      <div className="flex gap-2">
        <motion.button
          onClick={handleSaveContact}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors text-xs sm:text-sm"
        >
          <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Save to Contacts</span>
        </motion.button>
        <div className="relative" ref={shareMenuRef}>
          <motion.button
            onClick={() => setShowShareMenu(!showShareMenu)}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors text-xs sm:text-sm"
            aria-label="Share contact"
          >
            <FaShareAlt className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            <span className="sm:hidden">{copied ? '✓' : ''}</span>
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-0 mb-2 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 min-w-[240px] sm:min-w-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Share</h3>
                  <button
                    onClick={() => setShowShareMenu(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close share menu"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col items-center gap-1">
                    <FacebookShareButton
                      url={shareUrl}
                      quote={shareDescription}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <span className="text-xs text-gray-400">Facebook</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <TwitterShareButton
                      url={shareUrl}
                      title={shareTitle}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <span className="text-xs text-gray-400">Twitter</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <WhatsappShareButton
                      url={shareUrl}
                      title={shareTitle}
                      separator=" - "
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BA5A] transition-colors"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <span className="text-xs text-gray-400">WhatsApp</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <LinkedinShareButton
                      url={shareUrl}
                      title={shareTitle}
                      summary={shareDescription}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077B5] hover:bg-[#006399] transition-colors"
                    >
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <span className="text-xs text-gray-400">LinkedIn</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <TelegramShareButton
                      url={shareUrl}
                      title={shareTitle}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0088cc] hover:bg-[#0077b5] transition-colors"
                    >
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                    <span className="text-xs text-gray-400">Telegram</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <EmailShareButton
                      url={shareUrl}
                      subject={shareTitle}
                      body={shareDescription}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                    <span className="text-xs text-gray-400">Email</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

