'use client'

import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaWhatsapp, FaInstagram, FaShareAlt } from 'react-icons/fa'
import { ContactInfo } from '@/lib/vcard'
import { downloadVCard } from '@/lib/vcard'
import { useState } from 'react'

interface ContactButtonsProps {
  contact: ContactInfo
  whatsappUrl: string
  instagramUrl: string
}

export default function ContactButtons({ contact, whatsappUrl, instagramUrl }: ContactButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contact.name} - ${contact.title}`,
          text: `Contact ${contact.name}`,
          url: window.location.href,
        })
        return
      } catch (err) {
        // User cancelled or error occurred - fall through to clipboard
      }
    }
    
    // Fallback: copy to clipboard (with proper error handling)
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          alert('Unable to copy. Please copy this URL manually:\n' + window.location.href)
        }
        document.body.removeChild(textArea)
      }
    } catch (err) {
      // Final fallback: show URL in alert
      alert('Please copy this URL:\n' + window.location.href)
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
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                button.color === 'primary'
                  ? 'border-primary-500/30 bg-primary-950/30 hover:border-primary-500/50 hover:bg-primary-950/50 text-primary-300'
                  : 'border-accent-500/30 bg-accent-950/30 hover:border-accent-500/50 hover:bg-accent-950/50 text-accent-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{button.label}</span>
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
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors text-xs sm:text-sm"
        >
          <FaShareAlt className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
        </motion.button>
      </div>
    </div>
  )
}

