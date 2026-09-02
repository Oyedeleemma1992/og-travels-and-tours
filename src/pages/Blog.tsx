import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getStorage } from '../lib/storage';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const allPosts = getStorage('blog_posts');
    const published = allPosts.filter((p: any) => p.status === 'published');
    setPosts(published);
  }, []);

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="relative flex py-32 items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
            alt="Travel Blog"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Travel Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 sm:text-xl"
          >
            Tips, guides, and stories from our travels around the world.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xl">
              No blog posts published yet. Check back later!
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <p className="text-sm text-yellow-600 font-semibold mb-2">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <h2 className="text-2xl font-bold text-blue-950 mb-3">{post.title}</h2>
                    <p className="text-slate-600 line-clamp-3 mb-4">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
