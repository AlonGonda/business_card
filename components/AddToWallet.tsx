'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWallet } from 'react-icons/fa'

export default function AddToWallet() {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToWallet = () => {
    setIsAdding(true)
    
    // For iOS, we can use the Add to Wallet button
    // This requires a properly signed .pkpass file
    // For now, we'll provide instructions
    
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      // On iOS, try to open the wallet pass URL
      // You'll need to host a .pkpass file and link to it here
      const passUrl = '/api/wallet/pass.pkpass'
      
      // Try to add to wallet
      window.location.href = passUrl
      
      // Fallback: show instructions
      setTimeout(() => {
        alert('To add to Apple Wallet:\n\n1. Scan the QR code\n2. Or download the vCard and add to Contacts\n3. For a wallet pass, you need a signed .pkpass file')
        setIsAdding(false)
      }, 1000)
    } else {
      alert('Apple Wallet is only available on iOS devices. On other devices, you can:\n\n1. Scan the QR code to save contact\n2. Download the vCard file\n3. Add to your device\'s contact app')
      setIsAdding(false)
    }
  }

  return (
    <motion.button
      onClick={handleAddToWallet}
      disabled={isAdding}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
    >
      <FaWallet className="w-4 h-4" />
      <span className="text-sm">{isAdding ? 'Adding...' : 'Add to Wallet'}</span>
    </motion.button>
  )
}

