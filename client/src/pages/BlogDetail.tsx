import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { blogAPI } from '../lib/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) blogAPI.getBySlug(slug).then((res) => { setBlog(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-20"><LoadingSpinner size="lg" /></div>;
  if (!blog) return null;

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || `${blog.titleAr} | Book Beacon`}</title>
        <meta name="description" content={blog.metaDescription || blog.excerptAr} />
        <meta name="keywords" content={blog.keywords} />
      </Helmet>
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4" /> العودة للمدونة
          </Link>
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {blog.image && <img src={blog.image} alt={blog.titleAr} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.titleAr}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(blog.createdAt).toLocaleDateString('ar-EG')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readTime}</span>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.contentAr.replace(/\n/g, '<br/>') }} />
          </motion.article>
        </div>
      </div>
    </>
  );
}
