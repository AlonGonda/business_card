'use client'

import { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasStartedRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Use local audio file
    const audioFile = '/background-music.mp3'
    
    if (!audioRef.current) return
    
    // Create an invisible button that we can programmatically click
    let invisibleButton: HTMLButtonElement | null = null
    let buttonRemoved = false
    
    const createInvisibleButton = () => {
      if (invisibleButton && document.body.contains(invisibleButton)) {
        return invisibleButton
      }
      if (buttonRemoved) {
        return null
      }
      
      const button = document.createElement('button')
      button.style.position = 'fixed'
      button.style.top = '0'
      button.style.left = '0'
      button.style.width = '100%'
      button.style.height = '100%'
      button.style.opacity = '0'
      button.style.zIndex = '9999'
      button.style.cursor = 'default'
      button.style.border = 'none'
      button.style.background = 'transparent'
      button.style.pointerEvents = 'auto'
      // Don't use aria-hidden since it causes focus issues
      // Use inert if available, otherwise just make it non-focusable
      button.setAttribute('tabindex', '-1')
      button.setAttribute('type', 'button')
      if ('inert' in button) {
        (button as any).inert = false // We want it to be clickable
      }
      document.body.appendChild(button)
      invisibleButton = button
      return button
    }
    
    const removeInvisibleButton = () => {
      if (invisibleButton && document.body.contains(invisibleButton)) {
        try {
          document.body.removeChild(invisibleButton)
          buttonRemoved = true
        } catch (e) {
          // Button already removed, ignore
        }
      }
      invisibleButton = null
    }
    
    // Fade-in effect
    const fadeIn = () => {
      if (audioRef.current && fadeIntervalRef.current === null) {
        const targetVolume = 1
        const fadeDuration = 2000 // 2 seconds fade-in
        const fadeSteps = 50
        const volumeStep = targetVolume / fadeSteps
        const timeStep = fadeDuration / fadeSteps
        
        let currentStep = 0
        fadeIntervalRef.current = setInterval(() => {
          if (audioRef.current && currentStep < fadeSteps) {
            audioRef.current.volume = Math.min(volumeStep * currentStep, targetVolume)
            currentStep++
          } else {
            if (audioRef.current) {
              audioRef.current.volume = targetVolume
            }
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current)
              fadeIntervalRef.current = null
            }
          }
        }, timeStep)
      }
    }
    
    // Function to start playback
    const startPlayback = (userInitiated = false) => {
      if (!audioRef.current || hasStartedRef.current) return
      
      hasStartedRef.current = true
      
      // Set current time after a small delay to ensure audio is ready
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 15 // Start at 15 seconds
        }
      }, 50)
      
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Start fade-in after a brief delay
          setTimeout(fadeIn, 100)
        }).catch(err => {
          // If autoplay fails, reset the flag so we can try again
          hasStartedRef.current = false
          // Don't log errors for autoplay blocks - they're expected
          // Only log if it's a real user interaction AND not an autoplay block
          if (userInitiated && err.name !== 'NotAllowedError') {
            console.error('Playback error:', err)
          }
        })
      }
    }
    
    // Set up audio element
    audioRef.current.src = audioFile
    audioRef.current.loop = true
    audioRef.current.volume = 0 // Start at 0 volume for fade-in
    audioRef.current.preload = 'auto'
    
    // Track if we're in a programmatic click
    let isProgrammaticClick = false
    
    // Global click handler - works anywhere on the page
    const handleGlobalClick = (e: Event) => {
      // Check if this is a real user interaction
      const isRealUserInteraction = !isProgrammaticClick && 
        (e.isTrusted || (e as MouseEvent).isTrusted || (e as TouchEvent).isTrusted)
      
      if (audioRef.current && !hasStartedRef.current && isRealUserInteraction) {
        startPlayback(true)
      }
    }
    
    // Try to play when audio is ready
    const handleCanPlay = () => {
      setIsReady(true)
      if (audioRef.current && !hasStartedRef.current) {
        // Try to play, and if it fails, create invisible button
        startPlayback(false)
      }
    }
    
    // Handle when metadata is loaded
    const handleLoadedMetadata = () => {
      if (audioRef.current && !hasStartedRef.current) {
        // Try to play immediately
        if (audioRef.current.readyState >= 2) {
          startPlayback(false)
        }
      }
    }
    
    // Add event listeners
    audioRef.current.addEventListener('canplay', handleCanPlay)
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioRef.current.addEventListener('loadeddata', handleCanPlay)
    
    // Add global click handlers (not once, so they keep trying)
    document.addEventListener('click', handleGlobalClick, true)
    document.addEventListener('touchstart', handleGlobalClick, true)
    document.addEventListener('mousedown', handleGlobalClick, true)
    
    // Start loading
    audioRef.current.load()
    
    // Try multiple times to play (browsers may block initially)
    const playTimers: NodeJS.Timeout[] = []
    for (let i = 0; i < 3; i++) {
      const timer = setTimeout(() => {
        if (audioRef.current && !hasStartedRef.current) {
          if (audioRef.current.readyState >= 2) {
            startPlayback(false)
          }
        }
      }, 300 + (i * 500))
      playTimers.push(timer)
    }
    
    // Create invisible button and try to auto-click it
    const button = createInvisibleButton()
    if (button) {
      button.onclick = () => {
        if (audioRef.current && !hasStartedRef.current) {
          startPlayback(true)
        }
        // Remove button after first successful interaction
        setTimeout(() => {
          removeInvisibleButton()
        }, 1000)
      }
      
      // Make the button also respond to any user interaction
      button.addEventListener('click', handleGlobalClick, true)
      button.addEventListener('touchstart', handleGlobalClick, true)
      button.addEventListener('mousedown', handleGlobalClick, true)
    }
    
    // Try multiple techniques to programmatically trigger click after audio is ready
    const tryAutoClick = () => {
      if (!hasStartedRef.current && audioRef.current && audioRef.current.readyState >= 2) {
        const btn = invisibleButton || createInvisibleButton()
        if (!btn || !document.body.contains(btn)) {
          return
        }
        
        try {
          // Mark as programmatic to avoid error logging
          isProgrammaticClick = true
          
          // Method 1: Direct click
          btn.click()
          
          // Method 2: Dispatch synthetic events in sequence
          const events = ['mousedown', 'mouseup', 'click']
          events.forEach((eventType, index) => {
            setTimeout(() => {
              try {
                if (btn && document.body.contains(btn)) {
                  const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  })
                  btn.dispatchEvent(event)
                }
              } catch (e) {
                // Ignore if event creation fails
              }
            }, index * 10)
          })
          
          // Reset flag after a short delay
          setTimeout(() => {
            isProgrammaticClick = false
          }, 100)
        } catch (e) {
          isProgrammaticClick = false
          // Ignore errors
        }
      }
    }
    
    // Try auto-click at multiple intervals (but fewer attempts to reduce errors)
    const autoClickTimers: NodeJS.Timeout[] = []
    for (let i = 0; i < 3; i++) {
      const timer = setTimeout(tryAutoClick, 600 + (i * 300))
      autoClickTimers.push(timer)
    }
    
    return () => {
      playTimers.forEach(timer => clearTimeout(timer))
      autoClickTimers.forEach(timer => clearTimeout(timer))
      document.removeEventListener('click', handleGlobalClick, true)
      document.removeEventListener('touchstart', handleGlobalClick, true)
      document.removeEventListener('mousedown', handleGlobalClick, true)
      if (invisibleButton) {
        try {
          invisibleButton.removeEventListener('click', handleGlobalClick, true)
          invisibleButton.removeEventListener('touchstart', handleGlobalClick, true)
          invisibleButton.removeEventListener('mousedown', handleGlobalClick, true)
        } catch (e) {
          // Ignore if already removed
        }
      }
      removeInvisibleButton()
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay)
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current.removeEventListener('loadeddata', handleCanPlay)
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Hidden audio element for local file */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      />
    </>
  )
}

