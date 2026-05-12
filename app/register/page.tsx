'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setMessage('Registration successful! Redirecting...')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setMessage(data.message || 'Registration failed')
      }
    } catch {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-md w-full'
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Create Account</h1>
          <p className='text-gray-400'>Join Meghana Food for delicious campus meals</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className='bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl'
        >
          <form onSubmit={handleRegister} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-400 mb-2'>Full Name</label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all'
                    placeholder='     John Doe'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-400 mb-2'>Email Address</label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all'
                    placeholder='     john@example.com'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-400 mb-2'>Password</label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all'
                    placeholder='     ••••••••'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-400 mb-2'>Confirm Password</label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all'
                    placeholder='     ••••••••'
                    required
                  />
                </div>
              </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {success ? <CheckCircle className='w-5 h-5' /> : <AlertCircle className='w-5 h-5' />}
                <p className='text-sm font-medium'>{message}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading || success}
              className='w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all group'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              {!loading && <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />}
            </button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-gray-400'>
              Already have an account?{' '}
              <Link href='/login' className='text-orange-500 hover:text-orange-400 font-semibold'>
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
