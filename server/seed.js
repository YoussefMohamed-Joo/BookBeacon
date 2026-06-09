const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Blog = require('./models/Blog');
const DeliveryPrice = require('./models/DeliveryPrice');
const FAQ = require('./models/FAQ');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        phone: '01000000000',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isVerified: true,
      });
      console.log('Admin user created');

      await User.create({
        name: 'كاشير',
        email: 'cashier@bookbeacon.com',
        phone: '01000000001',
        password: 'cashier123',
        role: 'cashier',
        isVerified: true,
      });
      console.log('Cashier user created');
    } else {
      console.log('Admin already exists');
    }

    const booksCount = await Book.countDocuments();
    if (booksCount === 0) {
      const books = [
        {
          title: 'Physics 3rd Secondary',
          titleAr: 'الفيزياء تالتة ثانوي',
          slug: 'physics-3rd-secondary',
          grade: 'تالتة ثانوي',
          subject: 'الفيزياء',
          teacher: 'أ. أحمد محمد',
          price: 250, costPrice: 150,
          stock: 100,
          description: 'Comprehensive physics book for 3rd secondary school students following the Egyptian curriculum.',
          descriptionAr: 'كتاب الفيزياء الشامل لطلاب تالتة ثانوي وفقاً للمنهج المصري',
          keywords: 'فيزياء تالتة ثانوي, كتاب فيزياء, ثانوية عامة, physics 3rd secondary',
          metaTitle: 'كتاب الفيزياء تالتة ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب فيزياء للثانوية العامة تالتة ثانوي - شرح مبسط وأسئلة شاملة',
          salesCount: 45, rating: 4.5, numReviews: 12,
        },
        {
          title: 'Math 1st Secondary',
          titleAr: 'الرياضيات أولى ثانوي',
          slug: 'math-1st-secondary',
          grade: 'أولى ثانوي',
          subject: 'الرياضيات',
          teacher: 'أ. محمود علي',
          price: 220, costPrice: 130,
          stock: 150,
          description: 'Mathematics book for 1st secondary students.',
          descriptionAr: 'كتاب الرياضيات لطلاب أولى ثانوي',
          keywords: 'رياضيات أولى ثانوي, كتاب رياضيات, أولى ثانوي',
          metaTitle: 'كتاب الرياضيات أولى ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب رياضيات للصف الأول الثانوي',
          salesCount: 38, rating: 4.3, numReviews: 8,
        },
        {
          title: 'Chemistry 3rd Secondary',
          titleAr: 'الكيمياء تالتة ثانوي',
          slug: 'chemistry-3rd-secondary',
          grade: 'تالتة ثانوي',
          subject: 'الكيمياء',
          teacher: 'د. سارة أحمد',
          price: 260, costPrice: 155,
          stock: 80,
          description: 'Complete chemistry book for 3rd secondary.',
          descriptionAr: 'كتاب الكيمياء الشامل لتالتة ثانوي',
          keywords: 'كيمياء تالتة ثانوي, كتاب كيمياء, ثانوية عامة',
          metaTitle: 'كتاب الكيمياء تالتة ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب كيمياء للثانوية العامة تالتة ثانوي',
          salesCount: 32, rating: 4.6, numReviews: 15,
        },
        {
          title: 'Biology 3rd Secondary',
          titleAr: 'الأحياء تالتة ثانوي',
          slug: 'biology-3rd-secondary',
          grade: 'تالتة ثانوي',
          subject: 'الأحياء',
          teacher: 'أ. نادية حسن',
          price: 270, costPrice: 160,
          stock: 60,
          description: 'Biology book for 3rd secondary.',
          descriptionAr: 'كتاب الأحياء لتالتة ثانوي',
          keywords: 'أحياء تالتة ثانوي, كتاب أحياء, biology 3rd secondary',
          metaTitle: 'كتاب الأحياء تالتة ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب أحياء للثانوية العامة',
          salesCount: 28, rating: 4.4, numReviews: 10,
        },
        {
          title: 'Arabic 1st Secondary',
          titleAr: 'اللغة العربية أولى ثانوي',
          slug: 'arabic-1st-secondary',
          grade: 'أولى ثانوي',
          subject: 'اللغة العربية',
          teacher: 'أ. خالد عبدالله',
          price: 200, costPrice: 120,
          stock: 120,
          description: 'Arabic language book for 1st secondary.',
          descriptionAr: 'كتاب اللغة العربية لأولى ثانوي',
          keywords: 'عربي أولى ثانوي, كتاب عربي, لغة عربية',
          metaTitle: 'كتاب اللغة العربية أولى ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب عربي للصف الأول الثانوي',
          salesCount: 42, rating: 4.7, numReviews: 20,
        },
        {
          title: 'English 2nd Secondary',
          titleAr: 'اللغة الإنجليزية تانية ثانوي',
          slug: 'english-2nd-secondary',
          grade: 'تانية ثانوي',
          subject: 'اللغة الإنجليزية',
          teacher: 'أ. منى إبراهيم',
          price: 230, costPrice: 140,
          stock: 90,
          description: 'English language book for 2nd secondary.',
          descriptionAr: 'كتاب اللغة الإنجليزية لتانية ثانوي',
          keywords: 'انجليزي تانية ثانوي, كتاب انجليزي, English Egypt',
          metaTitle: 'كتاب اللغة الإنجليزية تانية ثانوي 2026 | Book Beacon',
          metaDescription: 'أفضل كتاب إنجليزي للصف الثاني الثانوي',
          salesCount: 35, rating: 4.2, numReviews: 7,
        },
      ];

      await Book.insertMany(books);
      console.log(`${books.length} books seeded`);
    }

    const deliveryCount = await DeliveryPrice.countDocuments();
    if (deliveryCount === 0) {
      const governorates = [
        'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
        'القليوبية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
        'دمياط', 'بورسعيد', 'السويس', 'الإسماعيلية', 'المنيا',
        'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
        'الفيوم', 'بني سويف', 'مطروح', 'الوادي الجديد', 'جنوب سيناء', 'شمال سيناء',
      ];

      const prices = governorates.map((g, i) => ({
        governorate: g,
        price: i < 5 ? 30 : i < 15 ? 45 : 60,
      }));

      await DeliveryPrice.insertMany(prices);
      console.log(`${prices.length} delivery prices seeded`);
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const blogs = [
        {
          title: 'Best 3rd Secondary Books 2026',
          titleAr: 'أفضل كتب تالتة ثانوي 2026',
          slug: 'best-3rd-secondary-books-2026',
          content: 'Here are the best books for 3rd secondary students in 2026...',
          contentAr: 'إليك أفضل الكتب لطلاب تالتة ثانوي في 2026. نقدم لك مجموعة مختارة من أفضل الكتب الخارجية لمساعدتك في التفوق في الثانوية العامة...',
          excerpt: 'Best 3rd secondary books',
          excerptAr: 'أفضل كتب تالتة ثانوي',
          keywords: 'أفضل كتب تالتة ثانوي, كتب خارجية, ثانوية عامة 2026',
          metaTitle: 'أفضل كتب تالتة ثانوي 2026 | Book Beacon',
          metaDescription: 'دليلك الشامل لأفضل كتب تالتة ثانوي 2026 - اختر الكتاب المناسب لتفوقك',
        },
        {
          title: 'How to Choose Your Physics Book',
          titleAr: 'إزاي تختار كتاب الفيزياء المناسب',
          slug: 'how-to-choose-physics-book',
          content: 'Choosing the right physics book is crucial...',
          contentAr: 'اختيار كتاب الفيزياء المناسب خطوة مهمة لنجاحك في الثانوية العامة. في هذا المقال نقدم لك نصائح لاختيار أفضل كتاب فيزياء...',
          excerpt: 'Tips for choosing physics book',
          excerptAr: 'نصائح لاختيار كتاب الفيزياء',
          keywords: 'اختيار كتاب فيزياء, أفضل كتاب فيزياء, فيزياء ثانوية عامة',
          metaTitle: 'إزاي تختار كتاب الفيزياء المناسب | Book Beacon',
          metaDescription: 'نصائح مهمة لاختيار أفضل كتاب فيزياء للثانوية العامة',
        },
      ];

      await Blog.insertMany(blogs);
      console.log(`${blogs.length} blogs seeded`);
    }

    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      const faqs = [
        {
          question: 'How can I order?',
          questionAr: 'كيف يمكنني طلب كتاب؟',
          answer: 'You can browse books and place an order through our website.',
          answerAr: 'يمكنك تصفح الكتب وطلبها من خلال موقعنا.',
        },
        {
          question: 'What payment methods do you accept?',
          questionAr: 'ما هي طرق الدفع المتاحة؟',
          answer: 'We accept Vodafone Cash payments.',
          answerAr: 'نقبل الدفع عبر فودافون كاش.',
        },
        {
          question: 'How long does delivery take?',
          questionAr: 'كم يستغرق التوصيل؟',
          answer: 'Delivery takes 2-5 business days depending on your location.',
          answerAr: 'يستغرق التوصيل من 2-5 أيام حسب موقعك.',
        },
        {
          question: 'Can I return a book?',
          questionAr: 'هل يمكنني إرجاع الكتاب؟',
          answer: 'Yes, you can return within 7 days if the book is in good condition.',
          answerAr: 'نعم، يمكنك الإرجاع خلال 7 أيام إذا كان الكتاب بحالة جيدة.',
        },
      ];

      await FAQ.insertMany(faqs);
      console.log(`${faqs.length} FAQs seeded`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
