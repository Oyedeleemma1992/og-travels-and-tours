import { motion } from 'motion/react';
import { Target, Eye, Heart, Users, Map, ShieldCheck, Plane } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Header */}
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop"
            alt="About Us"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            About OG Travels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Your trusted partner in global exploration since 2010.
          </motion.p>
        </div>
      </section>

      {/* Story & Stats */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-blue-950 mb-6">Our Story</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Founded with a passion for travel and a commitment to excellence, OG Travels & Tours has grown into a premier travel agency. We believe that travel is not just about visiting new places, but about creating lifelong memories and bridging cultures.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Over the years, we have built a reputation for reliability, personalized service, and deep industry expertise. Whether you're planning a complex corporate itinerary or a relaxing family getaway, our dedicated team is here to ensure every detail is perfect.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: 'Happy Clients', value: '10,000+', icon: Users },
                { label: 'Countries Served', value: '50+', icon: Map },
                { label: 'Visa Approvals', value: '98%', icon: ShieldCheck },
                { label: 'Flights Booked', value: '25,000+', icon: Plane },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-950">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-blue-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-yellow-500">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-400">To provide seamless, memorable, and high-quality travel experiences that exceed our clients' expectations.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-yellow-500">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-400">To be the most trusted and preferred travel partner globally, known for innovation and customer care.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-yellow-500">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Core Values</h3>
              <p className="text-slate-400">Integrity, Excellence, Customer-Centricity, Passion, and Continuous Improvement in all we do.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
