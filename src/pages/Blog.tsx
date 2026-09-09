import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Calendar } from 'lucide-react';
import { getStorage } from '../lib/storage';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      let apiSuccess = false;
      try {
        const response = await fetch('/api/v1/blogs');
        if (response.ok) {
          const data = await response.json();
          setPosts(Array.isArray(data) ? data : []);
          apiSuccess = true;
        }
      } catch (err) {
        console.warn("API not available for blogs, falling back to local storage");
      } finally {
        setIsLoading(false);
      }

      if (!apiSuccess) {
        const allPosts = getStorage('blog_posts');
        if (allPosts) {
          setPosts(allPosts.filter((p: any) => p.status === 'published'));
        }
      }
    };
    fetchBlogs();
  }, []);

  if (selectedPost) {
    return (
      <div className="flex flex-col w-full bg-slate-50 min-h-screen pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
          <button 
            onClick={() => setSelectedPost(null)}
            className="text-blue-600 font-medium mb-6 hover:underline flex items-center"
          >
            &larr; Back to all articles
          </button>
          {selectedPost.imageUrl && (
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 shadow-sm" />
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-6 leading-tight">
            {selectedPost.title}
          </h1>
          <div className="flex items-center text-slate-500 mb-10 border-b border-slate-200 pb-6">
            <div className="flex items-center mr-6">
              <User className="w-4 h-4 mr-2" />
              {selectedPost.author || 'Anonymous'}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {selectedPost.date ? new Date(selectedPost.date).toLocaleDateString() : 'Recent'}
            </div>
          </div>
          <div className="prose prose-lg prose-blue max-w-none text-slate-700 whitespace-pre-wrap">
            {selectedPost.content}
          </div>
        </div>
      </div>
    );
  }

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
          {isLoading ? (
            <div className="text-center py-20 text-slate-500 text-xl">
              Loading articles...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xl">
              No blog posts published yet. Check back later!
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div 
                  key={post.id || post._id || Math.random()} 
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-xs text-slate-500 mb-3 space-x-4">
                      <span className="flex items-center text-yellow-600 font-semibold">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author || 'Anonymous'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-950 mb-3 line-clamp-2">{post.title}</h2>
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-1">{post.excerpt || post.content}</p>
                    <div className="text-blue-600 font-medium text-sm mt-auto">Read Full Article &rarr;</div>
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
