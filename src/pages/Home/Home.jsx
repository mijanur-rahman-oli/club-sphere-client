import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Users, Calendar, Sparkles, Target, Heart, TrendingUp, Star, Award, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

const ClubCard = ({ club, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <Link to={`/club/${club._id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full border border-gray-100 dark:border-gray-700">
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={club.image || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={club.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm">
              {club.category || 'General'}
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-xl mb-2 dark:text-white line-clamp-2">{club.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              {club.description || 'Join us to explore amazing opportunities and connect with like-minded individuals.'}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Users size={16} className="mr-1.5" />
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold inline-flex items-center gap-1 group-hover:underline">
                View Details <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ClubCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4" />
    </div>
  </div>
);

const Home = () => {
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clubs`);
      return response.data;
    },
    select: (data) => data.slice(0, 6),
  });

  const features = [
    {
      icon: <Sparkles size={32} />,
      title: 'Smart Matching',
      description: 'AI-powered recommendations to find clubs that match your interests'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Event Management',
      description: 'Stay updated with club events and never miss an opportunity'
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Community Chat',
      description: 'Connect and communicate with club members instantly'
    },
    {
      icon: <Award size={32} />,
      title: 'Achievement System',
      description: 'Earn badges and recognition for your club participation'
    }
  ];

  const testimonials = [
    {
      name: 'Mijanur Rahman Oli',
      role: 'CSE Student',
      image: 'https://i.ibb.co.com/HfyHXXXs/Whats-App-Image-2026-01-10-at-14-45-52.jpg',
      text: 'ClubSphere helped me find my passion for coding. The Tech Club has been amazing!'
    },
    {
      name: 'Nafiz Kamal Talha',
      role: 'SWE Student',
      image: 'https://i.ibb.co.com/g1V1J3J/572065301-18029703938739190-5546304035530126258-n.jpg',
      text: 'I met incredible people and built lasting friendships through the clubs I joined here.'
    },
    {
      name: 'Proshanto Kumar',
      role: 'BBA Student',
      image: 'https://i.ibb.co.com/4nX4XqZW/651243344-18078508196618063-2161696549451018594-n.jpg',
      text: 'The platform makes it so easy to discover and participate in events. Highly recommend!'
    }
  ];

  const howItWorksSteps = [
    {
      icon: <Users size={40} />,
      title: 'Create Account',
      description: 'Sign up and complete your profile in minutes'
    },
    {
      icon: <Sparkles size={40} />,
      title: 'Discover Clubs',
      description: 'Browse through hundreds of student organizations'
    },
    {
      icon: <Heart size={40} />,
      title: 'Join & Connect',
      description: 'Become a member and start networking'
    },
    {
      icon: <Calendar size={40} />,
      title: 'Attend Events',
      description: 'Participate in exciting club activities and events'
    }
  ];

  const benefits = [
    {
      icon: <Target size={32} />,
      title: 'Find Your Passion',
      description: 'Explore diverse clubs matching your interests'
    },
    {
      icon: <Users size={32} />,
      title: 'Build Network',
      description: 'Connect with like-minded students'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Develop Skills',
      description: 'Gain leadership and practical experience'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center text-white">
        {/* Background image layer */}
        <img
          src="https://i.ibb.co.com/GvRthk1q/metrouni.png"
          alt="Students on campus at Metropolitan University"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        {/* Contrast overlay so text stays legible over the photo */}
        <div className="absolute inset-0 z-0 bg-gray-950/60" />

        <Container>
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight max-w-2xl">
              Discover Clubs That Inspire You
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-xl text-gray-200">
              Explore local organizations, find your passion, and connect with a community that shares it.
            </p>

            <Link to="/club">
              <motion.button
                className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join a Club
              </motion.button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Featured
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 dark:text-white">
                Popular Clubs
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Discover the most active communities on campus right now
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ClubCardSkeleton key={i} />
                ))}
              </div>
            ) : clubs.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No clubs to show yet — check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, index) => (
                  <ClubCard key={club._id} club={club} index={index} />
                ))}
              </div>
            )}

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/club">
                <motion.button
                  className="text-blue-600 dark:text-blue-400 font-semibold text-base border-2 border-blue-600 dark:border-blue-400 px-8 py-3 rounded-lg inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Clubs <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Platform
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 dark:text-white">
                Everything You Need
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Tools built for running and growing a modern student club
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-100 dark:border-gray-800 shadow-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Get Started
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 dark:text-white">
                How ClubSphere Works
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Four simple steps to your first club
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <motion.div
                    className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-100 dark:border-gray-800"
                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-lg font-bold mb-2 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                  </motion.div>

                  {index < howItWorksSteps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index + 1) * 0.15 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Why Join Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <span className="text-lime-600 dark:text-lime-400 font-semibold text-sm uppercase tracking-wider">
                Benefits
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">
                Why Join a Club?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Being part of a club enriches your college experience in countless ways
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(132, 204, 22, 0.1), 0 10px 10px -5px rgba(132, 204, 22, 0.04)"
                  }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/5 rounded-bl-full rounded-tr-2xl group-hover:bg-lime-500/10 transition-colors" />

                  <motion.div
                    className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-white transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {benefit.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Testimonials
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 dark:text-white">
                What Members Say
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Hear from students who transformed their college experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                      className="w-11 h-11 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-6">
                <Mail size={28} className="text-blue-600 dark:text-blue-400" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                Join our newsletter
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
                Get the latest club updates, professional opportunities, and curated events delivered to your inbox.
              </p>

              <form
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@university.edu"
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 outline-none transition-all placeholder:text-gray-400"
                />
                <motion.button
                  type="submit"
                  className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </form>

              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
};

export default Home;