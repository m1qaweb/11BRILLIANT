'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, UserPlus, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function AuthRequiredModal({ isOpen, onClose, redirectTo }: AuthRequiredModalProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const handleRegister = () => {
    const returnUrl = redirectTo || window.location.pathname
    router.push(`/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleLogin = () => {
    const returnUrl = redirectTo || window.location.pathname
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  return (
    <AnimatePresence>
      {isOpen && !isClosing && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md pointer-events-auto"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8 sm:p-10 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6"
                  >
                    <Lock className="w-10 h-10 text-blue-600" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 georgian-heading"
                  >
                    რეგისტრაცია აუცილებელია
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base text-gray-600 mb-8 georgian-body leading-relaxed"
                  >
                    გაკვეთილებზე წვდომისთვის გთხოვთ გაიაროთ რეგისტრაცია
                    <span className="block mt-2 font-semibold text-gray-700">
                      შეძლებთ თქვენი პროგრესის ნახვას და XP-ის დაგროვებას! 🚀
                    </span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
                  >
                    <h3 className="text-sm font-bold text-gray-700 mb-3 georgian-body">რა მიიღებთ:</h3>
                    <ul className="space-y-2 text-sm text-gray-600 georgian-body text-left">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>XP-ის დაგროვება და დონეების ამაღლება</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>პროგრესის ნახვა</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>სთრიქების აღება</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>მიღწევების მიღება</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <button
                      onClick={handleRegister}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl georgian-body"
                    >
                      <UserPlus className="w-5 h-5" />
                      რეგისტრაცია
                    </button>

                    <button
                      onClick={handleLogin}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-gray-700 font-bold text-base hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-[1.02] transition-all duration-300 georgian-body"
                    >
                      <LogIn className="w-5 h-5" />
                      შესვლა
                    </button>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={handleClose}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline georgian-body"
                  >
                    უკან დაბრუნება
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
