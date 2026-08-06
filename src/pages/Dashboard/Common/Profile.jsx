import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import coverImg from '../../../assets/images/cover.jpg'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import UpdateProfileModal from '../../../components/Modal/UpdateProfileModal'

const Profile = () => {
  const { user, resetPassword } = useAuth()
  const [role, isRoleLoading] = useRole()
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [resetStatus, setResetStatus] = useState('') // '', 'sending', 'sent', 'error'

  if (isRoleLoading) return <LoadingSpinner />

  const handleChangePassword = async () => {
    if (!user?.email) return
    setResetStatus('sending')
    try {
      await resetPassword(user.email)
      setResetStatus('sent')
    } catch (err) {
      console.error('Error sending reset email:', err)
      setResetStatus('error')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <div className='bg-white shadow-xl rounded-3xl overflow-hidden md:w-4/5 lg:w-2/5 border border-gray-100'>
        {/* Cover Image */}
        <div className='relative h-48 w-full'>
          <img
            alt='cover'
            src={coverImg}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/20'></div>
        </div>

        {/* Profile Header */}
        <div className='relative flex flex-col items-center p-6 -mt-20'>
          <div className='relative group'>
            <img
              alt='profile'
              src={user?.photoURL}
              className='h-32 w-32 object-cover rounded-3xl border-4 border-white shadow-lg transform transition group-hover:scale-105'
            />
            <span className='absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full'></span>
          </div>

          <div className='mt-4 text-center'>
            <h2 className='text-2xl font-bold text-gray-800 uppercase tracking-tight'>
              {user?.displayName}
            </h2>
            <span className='inline-block mt-1 px-4 py-1 text-xs font-semibold tracking-wider text-lime-700 uppercase bg-lime-100 rounded-full'>
              {role}
            </span>
          </div>

          {/* Details Section */}
          <div className='w-full mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100'>
            <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 text-sm'>
              <div className='flex flex-col'>
                <span className='text-gray-400 font-medium'>Full Name</span>
                <span className='text-gray-900 font-semibold'>{user?.displayName}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-gray-400 font-medium'>Email Address</span>
                <span className='text-gray-900 font-semibold'>{user?.email}</span>
              </div>
              <div className='flex flex-col sm:col-span-2'>
                <span className='text-gray-400 font-medium'>User Unique ID</span>
                <span className='text-xs font-mono text-gray-500 truncate'>{user?.uid}</span>
              </div>
            </div>
          </div>

          {/* Reset status feedback */}
          {resetStatus === 'sent' && (
            <p className='mt-4 text-sm text-lime-600 font-medium'>
              Password reset email sent — check your inbox.
            </p>
          )}
          {resetStatus === 'error' && (
            <p className='mt-4 text-sm text-red-500 font-medium'>
              Couldn&apos;t send reset email. Please try again.
            </p>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 w-full mt-8'>
            <button
              onClick={() => setShowUpdateModal(true)}
              className='flex-1 bg-lime-500 text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-lime-600 active:scale-95 shadow-md shadow-lime-200'
            >
              Update Profile
            </button>
            <button
              onClick={handleChangePassword}
              disabled={resetStatus === 'sending'}
              className='flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-gray-800 active:scale-95 shadow-md shadow-gray-200 disabled:opacity-60'
            >
              {resetStatus === 'sending' ? 'Sending...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateProfileModal closeModal={() => setShowUpdateModal(false)} />
      )}
    </div>
  )
}

export default Profile