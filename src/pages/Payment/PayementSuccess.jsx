import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { IoBagCheckOutline } from 'react-icons/io5'
import { MdError } from 'react-icons/md'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const typeParam = searchParams.get('type') // 'club' | 'event'
  const [verificationStatus, setVerificationStatus] = useState('verifying')
  const [error, setError] = useState(null)
  const [resultType, setResultType] = useState(typeParam || 'club')

  useEffect(() => {
    console.log('Payment Success page loaded')
    console.log('Session ID:', sessionId)
    console.log('Type:', typeParam)
    console.log('API URL:', import.meta.env.VITE_API_URL)

    if (!sessionId) {
      console.error('No session ID found in URL')
      setVerificationStatus('error')
      setError('No session ID provided')
      return
    }

    const verifyPayment = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/verify-payment/${sessionId}`
        console.log('Calling verification endpoint:', url)

        const response = await axios.get(url)
        console.log('Verification response:', response.data)

        // Prefer the type the backend actually recorded on the Stripe session,
        // fall back to the URL param in case the backend response omits it
        if (response.data.type) {
          setResultType(response.data.type)
        }

        if (response.data.success) {
          setVerificationStatus('success')
          console.log('Payment verified successfully!')
        } else {
          setVerificationStatus('failed')
          setError(response.data.message || 'Payment verification failed')
          console.log('⚠️ Payment verification failed:', response.data)
        }
      } catch (error) {
        console.error('Verification error:', error)
        console.error('Error details:', error.response?.data || error.message)
        setVerificationStatus('error')
        setError(error.response?.data?.error || error.message || 'Verification failed')
      }
    }

    verifyPayment()
  }, [sessionId, typeParam])

  if (verificationStatus === 'verifying') {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mb-4'></div>
        <p className='text-gray-600'>Verifying your payment...</p>
      </div>
    )
  }

  if (verificationStatus === 'error' || verificationStatus === 'failed') {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='bg-white p-10 rounded-lg shadow-lg text-center max-w-md'>
          <MdError className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Verification {verificationStatus === 'error' ? 'Error' : 'Failed'}
          </h1>
          <p className='text-gray-600 mb-6'>
            {error || 'There was a problem verifying your payment.'}
          </p>
          <Link
            to='/'
            className='inline-block bg-lime-500 text-white font-semibold py-2 px-4 rounded hover:bg-lime-600 transition duration-300'
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const isEvent = resultType === 'event'

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='bg-white p-10 rounded-lg shadow-lg text-center'>
        <IoBagCheckOutline className='w-16 h-16 text-green-500 mx-auto mb-4' />
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          {isEvent ? 'Registration Successful!' : 'Purchase Successful!'}
        </h1>
        <p className='text-gray-600 mb-6'>
          {isEvent
            ? 'Thank you — your spot at the event is confirmed.'
            : 'Thank you for your purchase.'}
        </p>
        <Link
          to={isEvent ? '/dashboard/my-events' : '/dashboard/my-orders'}
          className='inline-block bg-lime-500 text-white font-semibold py-2 px-4 rounded hover:bg-lime-600 transition duration-300'
        >
          {isEvent ? 'My Events' : 'My Clubs'}
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess