import { useState } from 'react'
import { getAuth } from 'firebase/auth'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const UpdateProfileModal = ({ closeModal }) => {
  const { user, setUser, updateUserProfile } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [name, setName] = useState(user?.displayName || '')
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name cannot be empty.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // 1. Update Firebase Auth profile
      await updateUserProfile(name.trim(), photoURL.trim())

      // 2. Refresh local user object (onAuthStateChanged won't fire for this)
      const auth = getAuth()
      await auth.currentUser.reload()
      setUser({ ...auth.currentUser })

      // 3. Sync to MongoDB so backend records (bookings, registrations, etc.) stay current
      await axiosSecure.patch(`/users/${user.email}`, {
        name: name.trim(),
        photoURL: photoURL.trim(),
      })

      closeModal()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Update Profile</h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-400'
              placeholder='Your name'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Photo URL
            </label>
            <input
              type='text'
              value={photoURL}
              onChange={e => setPhotoURL(e.target.value)}
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-400'
              placeholder='https://...'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={closeModal}
              disabled={isSubmitting}
              className='flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 bg-lime-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-lime-600 transition-colors disabled:opacity-60'
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfileModal