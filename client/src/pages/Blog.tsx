import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/animations/ScrollReveal';
import { blogAPI } from '../lib/api';

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getAll().then((res) => { setBlogs(res.data.blogs); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>المدونة | Book Beacon - نصائح ومراجعات كتب الثانوية العامة</title>
        <meta name="description" content="مدونة Book Beacon - نصائح لاختيار كتب الثانوية العامة، مراجعات، وأفضل التوصيات لطلاب الثانوية في مصر." />
      </Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="section-title !text-2xl md:!text-3xl !mb-0">المدونة</h1>
                <p className="section-subtitle !mb-0">نصائح ومقالات عن كتب الثانوية العامة</p>
              </div>
            </div>
          </motion.div>

          {loading ? <LoadingSpinner /> : (
            <div className="space-y-5">
              {blogs.map((blog: any, i: number) => (
                <ScrollReveal key={blog._id} delay={i * 0.08}>
                  <Link to={`/blog/${blog.slug}`} className="block group">
                    <div className="bg-white dark:bg-dark-800/50 rounded-2xl p-6 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">{blog.titleAr}</h2>
                      <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {blog.excerptAr || blog.contentAr.substring(0, 150)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                        {blog.readTime && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readTime}
                          </span>
                        )}
                        <span className="mr-auto text-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          اقرأ المزيد <ArrowLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
