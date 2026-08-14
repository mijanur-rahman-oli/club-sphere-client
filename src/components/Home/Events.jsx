import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import Container from '../Shared/Container';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { getAuth } from 'firebase/auth';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react';
import { useState } from 'react';

const Events = () => {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const auth = getAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch all events with sorting
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', sortBy],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`, {
        params: { sort: sortBy },
      });
      return res.data;
    },
  });

  // Fetch registrations
  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const token = await auth.currentUser.getIdToken();
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Fetch bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const token = await auth.currentUser.getIdToken();
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/my-bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Register mutation — FREE events only (backend rejects paid events on this route)
  const registerMutation = useMutation({
    mutationFn: async (eventId) => {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event!');
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['registrations']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Registration failed');
    },
  });

  // Checkout mutation — PAID events. Creates a Stripe session and redirects the browser to it.
  const checkoutMutation = useMutation({
    mutationFn: async (paymentInfo) => {
      const token = await auth.currentUser.getIdToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        paymentInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not start checkout. Please try again.');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Checkout failed');
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ eventId, action }) => {
      if (!user) throw new Error('Please login to bookmark events');

      const token = await auth.currentUser.getIdToken();
      const url = `${import.meta.env.VITE_API_URL}/events/${eventId}/bookmark`;

      return action === 'add'
        ? axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
        : axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: (_, variables) => {
      toast.success(variables.action === 'add' ? 'Added to wishlist!' : 'Removed from wishlist');
      queryClient.invalidateQueries(['bookmarks']);
    },
    onError: () => {
      toast.error('Please login to bookmark events');
    },
  });

  const handleRegister = (event) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }
    if (event.maxAttendees && (event.registrationsCount || 0) >= event.maxAttendees) {
      toast.error('Event is full!');
      return;
    }
    if (registrations.some(r => r.eventId === event._id)) {
      toast.error('You are already registered for this event');
      return;
    }

    // Paid events go through Stripe Checkout; free events register directly
    if (event.isPaid) {
      checkoutMutation.mutate({
        type: 'event',
        eventId: event._id,
        name: event.title,
        description: event.description,
        price: event.eventFee,
        image: event.image || '',
        customer: {
          email: user.email,
          name: user.displayName,
          image: user.photoURL || '',
        },
      });
      return;
    }

    registerMutation.mutate(event._id);
  };

  const handleBookmark = (eventId, isBookmarked, e) => {
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to bookmark events');
      return;
    }

    bookmarkMutation.mutate({
      eventId,
      action: isBookmarked ? 'remove' : 'add',
    });
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'registered') {
      return registrations.some(r => r.eventId === event._id);
    }
    if (filterStatus === 'wishlist') {
      return bookmarks.some(b => b.eventId === event._id);
    }
    return true;
  });

  // Stats
  const totalEventsCount = events.length;
  const registeredCount = registrations.length;
  const bookmarkedCount = bookmarks.filter(b => b.eventId).length;

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'oldest', label: 'Oldest First', icon: '📅' },
    { value: 'fee-high', label: 'Highest Fee', icon: '💰' },
    { value: 'fee-low', label: 'Lowest Fee', icon: '💵' },
  ];

  if (eventsLoading || authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  py-20 md:py-24">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl mb-3 shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and join exciting events happening in your community
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 items-center justify-between">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 inline-flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filterStatus === 'all'
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Events ({totalEventsCount})
            </button>
            <button
              onClick={() => setFilterStatus('registered')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filterStatus === 'registered'
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Registered ({registeredCount})
            </button>
            <button
              onClick={() => setFilterStatus('wishlist')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                filterStatus === 'wishlist'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Wishlist ({bookmarkedCount})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3 pr-12 font-bold text-sm text-gray-700 shadow-sm hover:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredEvents.map(event => {
              const currentCount = event.registrationsCount || 0;
              const isFull = event.maxAttendees && currentCount >= event.maxAttendees;
              const isRegistered = registrations.some(r => r.eventId === event._id);
              const isBookmarked = bookmarks.some(b => b.eventId === event._id);
              const spotsLeft = event.maxAttendees ? event.maxAttendees - currentCount : null;

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-xl transition-all duration-300 group relative"
                >
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleBookmark(event._id, isBookmarked, e)}
                    disabled={bookmarkMutation.isLoading}
                    className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-rose-500 fill-rose-500" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-gray-400 hover:text-rose-500" />
                    )}
                  </button>

                  {/* Badges Container */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                    {isRegistered && (
                      <span className="bg-green-500 text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Registered
                      </span>
                    )}
                    {isFull && !isRegistered && (
                      <span className="bg-gray-800 text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-lg shadow-sm">
                        Sold Out
                      </span>
                    )}
                    {!isFull && !isRegistered && spotsLeft <= 5 && spotsLeft > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-lg shadow-sm animate-pulse">
                        {spotsLeft} Spots Left
                      </span>
                    )}
                  </div>

                  <div className="mb-4 mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-lime-600 transition-colors line-clamp-2 leading-tight">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    {event.club && (
                      <div className="inline-block px-3 py-1 bg-lime-50 text-lime-700 rounded-lg text-xs font-bold border border-lime-100">
                        {event.club.name}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-lime-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {dayjs(event.eventDate).format('MMM DD, YYYY')}
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase font-medium">
                          {dayjs(event.eventDate).format('dddd @ h:mm A')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-lime-600">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium truncate">{event.location}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-lime-600">
                        {event.isPaid ? <DollarSign className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                      <p className={`text-sm font-bold ${event.isPaid ? 'text-gray-900' : 'text-green-600'}`}>
                        {event.isPaid ? `$${event.eventFee}` : 'Free Entry'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(event)}
                    disabled={isRegistered || isFull || registerMutation.isLoading || checkoutMutation.isLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                      isRegistered
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed'
                        : isFull
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'bg-lime-500 text-white hover:bg-lime-600 hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {registerMutation.isLoading || checkoutMutation.isLoading ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : isRegistered ? (
                      'You are in!'
                    ) : isFull ? (
                      'No Spots Available'
                    ) : event.isPaid ? (
                      `Pay $${event.eventFee} & Register`
                    ) : (
                      'Register Now'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              We couldn't find any events matching your current filter.
            </p>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Events;