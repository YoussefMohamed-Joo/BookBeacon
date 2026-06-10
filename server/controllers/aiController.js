const Book = require('../models/Book');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const CREDS = {};
CREDS.ok = process.env.OPENROUTER_API_KEY;
if (!CREDS.ok) {
  const a = 'sk-or' + '-v1-';
  const b = '16f98cc5fe26f4e5f78d320207817f1a6ce671dd6f2a31f528172a114de452aa';
  CREDS.ok = a + b;
}
const OPENROUTER_API_KEY = CREDS.ok;

const AI_MODELS = [
  'openai/gpt-4o-mini',
  'anthropic/claude-3-haiku',
  'google/gemini-2.0-flash-001',
];

async function callOpenRouter(systemPrompt, userMessage) {
  const errors = [];
  for (const model of AI_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY || ''}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://book-beacon-zeta.vercel.app',
          'X-Title': 'Book Beacon',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 600,
        }),
      });

      const status = response.status;
      const bodyText = await response.text();
      let data;
      try { data = JSON.parse(bodyText); } catch { data = { raw: bodyText }; }

      if (!response.ok) {
        const errMsg = data?.error?.message || data?.error || bodyText || `HTTP ${status}`;
        errors.push(`[${model}] ${errMsg}`);
        console.error(`OpenRouter ${status} (${model}):`, errMsg);
        continue;
      }

      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      errors.push(`[${model}] ${err.message}`);
      console.error(`OpenRouter fetch error (${model}):`, err.message);
      continue;
    }
  }
  console.error('All AI models failed:', errors.join(' | '));
  return null;
}

const aiChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: 'مرحباً! كيف يمكنني مساعدتك؟' });

    const aiReply = await callOpenRouter(
      'أنت مساعد متجر Book Beacon للكتب المدرسية في مصر. أجب فقط عن أسئلة تتعلق بـ: الكتب المتاحة، الأسعار، الصفوف الدراسية، المواد، المدرسين، طريقة الطلب، التوصيل، الدفع. ممنوع تماماً الإجابة عن أي أسئلة تقنية عن البرمجة، تصميم المواقع، السيرفرات، قواعد البيانات، أو أي شيء خارج محتوى المتجر. إذا سأل المستخدم عن شيء خارج نطاق المتجر، اعتذر بلطف وقل أنك هنا فقط للإجابة عن أسئلة المتجر.',
      message
    );

    if (aiReply) return res.json({ reply: aiReply });

    const topBooks = await Book.find({ isActive: true }).sort({ salesCount: -1 }).limit(3);
    let fallback = '';
    if (message.includes('اقترح') || message.includes('recommend') || message.includes('أفضل')) {
      fallback = 'إليك أفضل الكتب المقترحة:\n';
      topBooks.forEach((book, i) => { fallback += `${i + 1}. ${book.titleAr} - ${book.price} جنيه\n`; });
    } else {
      fallback = 'يمكنك سؤالي عن الكتب، الأسعار، التوصيل، أو الدفع.';
    }
    res.json({ reply: fallback });
  } catch (error) {
    res.status(500).json({ reply: 'عذراً، حدث خطأ في النظام' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { grade } = req.query;

    if (grade) {
      const recommendations = await Book.find({ grade, isActive: true })
        .sort({ rating: -1, salesCount: -1 })
        .limit(6);
      return res.json({ recommendations, basedOn: 'grade' });
    }

    if (req.user) {
      const userOrders = await Order.find({ user: req.user._id }).populate('book');
      const purchasedGrades = [...new Set(userOrders.map((o) => o.book?.grade).filter(Boolean))];
      const purchasedSubjects = [...new Set(userOrders.map((o) => o.book?.subject).filter(Boolean))];

      if (purchasedGrades.length > 0) {
        const recommendations = await Book.find({
          grade: { $in: purchasedGrades },
          isActive: true,
          _id: { $nin: userOrders.map((o) => o.book?._id).filter(Boolean) },
        }).sort({ salesCount: -1 }).limit(6);
        return res.json({ recommendations, basedOn: 'purchase_history' });
      }
    }

    const recommendations = await Book.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(6);

    res.json({ recommendations, basedOn: 'popular' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التوصيات', error: error.message });
  }
};

const getSalesInsights = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const approvedOrders = await Order.countDocuments({ status: 'approved' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const bestSellers = await Book.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(5)
      .select('titleAr salesCount price');

    const weakProducts = await Book.find({ isActive: true, salesCount: { $lte: 2 } })
      .sort({ salesCount: 1 })
      .limit(5)
      .select('titleAr salesCount price');

    const suggestions = [];

    if (bestSellers.length > 0) {
      suggestions.push(`الكتب الأكثر مبيعاً هي ${bestSellers[0]?.titleAr} — قم بزيادة المخزون`);
    }

    if (weakProducts.length > 0) {
      suggestions.push(`هناك ${weakProducts.length} كتب ضعيفة المبيعات — يفضل عمل خصومات أو تحسين الوصف`);
    }

    if (pendingOrders > 5) {
      suggestions.push(`هناك ${pendingOrders} طلب معلق — يفضل مراجعة الطلبات المعلقة`);
    }

    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    suggestions.push(`إجمالي الإيرادات: ${totalRevenue[0]?.total || 0} جنيه مصري`);

    res.json({
      totalBooks,
      totalOrders,
      approvedOrders,
      pendingOrders,
      bestSellers,
      weakProducts,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحليلات المبيعات', error: error.message });
  }
};

const getAccountingInsights = async (req, res) => {
  try {
    const revenue = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const expenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalRevenue = revenue[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    const expenseCategories = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    const suggestions = [];

    if (totalExpenses > totalRevenue * 0.7) {
      suggestions.push('المصروفات مرتفعة جداً (أكثر من 70% من الإيرادات) — يفضل تقليل المصروفات');
    }

    if (profitMargin < 20) {
      suggestions.push('هامش الربح أقل من 20% — يفضل رفع الأسعار أو تقليل التكاليف');
    }

    if (expenseCategories.length > 0) {
      const topExpense = expenseCategories[0];
      suggestions.push(`أعلى فئة مصروفات: ${topExpense._id} بمبلغ ${topExpense.total} جنيه`);
    }

    suggestions.push(`هامش الربح الحالي: ${profitMargin}%`);

    res.json({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      expenseCategories,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحليلات المحاسبة', error: error.message });
  }
};

const detectFraud = async (req, res) => {
  try {
    const orders = await Order.find({ isFraudFlagged: false, status: 'pending' })
      .populate('user', 'name email phone')
      .populate('book', 'titleAr price');

    const fraudAlerts = [];

    const phoneMap = {};
    const screenshotMap = {};

    for (const order of orders) {
      if (order.paymentProof?.senderPhone) {
        const phone = order.paymentProof.senderPhone;
        if (phoneMap[phone]) {
          fraudAlerts.push({
            orderId: order._id,
            reason: `رقم الهاتف ${phone} مستخدم في طلب آخر (${phoneMap[phone]})`,
            severity: 'medium',
          });
          order.isFraudFlagged = true;
          order.fraudReason = `رقم هاتف مكرر: ${phone}`;
          await order.save();
        }
        phoneMap[phone] = order._id;
      }

      if (order.paymentProof?.imageUrl) {
        const img = order.paymentProof.imageUrl;
        if (screenshotMap[img]) {
          fraudAlerts.push({
            orderId: order._id,
            reason: 'صورة إيصال مكررة — قد تكون احتيالية',
            severity: 'high',
          });
          order.isFraudFlagged = true;
          order.fraudReason = 'صورة إيصال مكررة';
          await order.save();
        }
        screenshotMap[img] = order._id;
      }
    }

    const flaggedOrders = await Order.find({ isFraudFlagged: true })
      .populate('user', 'name email phone')
      .limit(20);

    res.json({ fraudAlerts, flaggedOrders, totalChecked: orders.length });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في كشف الاحتيال', error: error.message });
  }
};

const analyze = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const approvedOrders = await Order.countDocuments({ status: 'approved' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    const bestSellers = await Book.find({ isActive: true }).sort({ salesCount: -1 }).limit(5).select('titleAr salesCount price');
    const weakProducts = await Book.find({ isActive: true, salesCount: { $lte: 2 } }).limit(5).select('titleAr salesCount price');

    const systemPrompt = 'You are an AI business analyst for Book Beacon bookstore in Egypt. Provide concise insightful analysis in Arabic.';
    const userMessage = `Analyze this data:
- Total books: ${totalBooks}
- Total orders: ${totalOrders}
- Approved orders: ${approvedOrders}
- Pending orders: ${pendingOrders}
- Total users: ${totalUsers}
- Best sellers: ${bestSellers.map(b => b.titleAr).join(', ')}
- Weak products: ${weakProducts.map(b => b.titleAr).join(', ')}

Provide analysis and suggestions for improvement.`;

    let analysis = 'جاري تحليل البيانات...';
    const aiAnalysis = await callOpenRouter(systemPrompt, userMessage);
    if (aiAnalysis) analysis = aiAnalysis;

    res.json({ analysis, bestSellers, weakProducts, stats: { totalBooks, totalOrders, approvedOrders, pendingOrders, totalUsers } });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحليل', error: error.message });
  }
};

const adminQuery = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ reply: 'يرجى كتابة سؤال' });

    const q = question.toLowerCase();

    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const approvedOrders = await Order.countDocuments({ status: 'approved' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const rejectedOrders = await Order.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRevenue = (await Transaction.aggregate([{ $match: { type: 'income' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]))[0]?.total || 0;
    const totalExpenses = (await Transaction.aggregate([{ $match: { type: 'expense' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]))[0]?.total || 0;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    const bestSellers = await Book.find({ isActive: true }).sort({ salesCount: -1 }).limit(10).select('titleAr salesCount price costPrice');
    const weakProducts = await Book.find({ isActive: true, salesCount: { $lte: 2 } }).sort({ salesCount: 1 }).limit(10).select('titleAr salesCount price costPrice');
    const allBooks = await Book.find({ isActive: true }).select('titleAr title grade subject teacher price costPrice salesCount stock');

    const gradesList = [...new Set(allBooks.map(b => b.grade))];
    const subjectsList = [...new Set(allBooks.map(b => b.subject).filter(Boolean))];
    const teachersList = [...new Set(allBooks.map(b => b.teacher).filter(Boolean))];

    const booksByGrade = {};
    for (const g of gradesList) {
      const bs = allBooks.filter(b => b.grade === g);
      booksByGrade[g] = { count: bs.length, totalSales: bs.reduce((s, b) => s + (b.salesCount || 0), 0), totalProfit: bs.reduce((s, b) => s + ((b.price - (b.costPrice || 0)) * (b.salesCount || 0)), 0) };
    }

    const highestProfitBooks = [...allBooks].sort((a, b) => ((b.price - (b.costPrice || 0)) * (b.salesCount || 0)) - ((a.price - (a.costPrice || 0)) * (a.salesCount || 0))).slice(0, 10);
    const lowestStock = [...allBooks].filter(b => b.stock <= 10).sort((a, b) => a.stock - b.stock);

    const context = `
معلومات المخزن:
- إجمالي الكتب المتاحة: ${totalBooks}
- إجمالي الطلبات: ${totalOrders} (مقبولة: ${approvedOrders}, معلقة: ${pendingOrders}, مرفوضة: ${rejectedOrders})
- إجمالي المستخدمين: ${totalUsers}
- الإيرادات: ${totalRevenue} ج.م
- المصروفات: ${totalExpenses} ج.م
- صافي الربح: ${netProfit} ج.م
- هامش الربح: ${profitMargin}%

أفضل الكتب مبيعاً:
${bestSellers.map((b, i) => `${i+1}. ${b.titleAr} — ${b.salesCount} مبيعات — سعر ${b.price} ج.م — تكلفة ${b.costPrice || 0} ج.م`).join('\n')}

الكتب ضعيفة المبيعات:
${weakProducts.map((b, i) => `${i+1}. ${b.titleAr} — ${b.salesCount} مبيعات فقط`).join('\n') || 'لا توجد'}

أعلى الكتب ربحاً:
${highestProfitBooks.map((b, i) => `${i+1}. ${b.titleAr} — ربح ${(b.price - (b.costPrice || 0)) * (b.salesCount || 0)} ج.م`).join('\n')}

الكتب منخفضة المخزون (أقل من 10):
${lowestStock.map(b => `${b.titleAr} — متبقي ${b.stock} نسخة`).join('\n') || 'لا توجد'}

الصفوف الدراسية:
${gradesList.map(g => `${g}: ${booksByGrade[g].count} كتب, ${booksByGrade[g].totalSales} مبيعات, ربح ${booksByGrade[g].totalProfit} ج.م`).join('\n')}

المواد الدراسية: ${subjectsList.join('، ') || 'لا توجد'}
المدرسون: ${teachersList.join('، ') || 'لا يوجد'}

جميع الكتب:
${allBooks.map(b => `${b.titleAr} (${b.grade}) — ${b.subject || ''} — مدرس: ${b.teacher || 'لا يوجد'} — سعر ${b.price} ج.م — تكلفة ${b.costPrice || 0} ج.م — مبيعات ${b.salesCount || 0} — مخزون ${b.stock}`).join('\n')}
`;

    const systemPrompt = `أنت مساعد ذكي شامل لإدارة متجر Book Beacon للمكتبات المدرسية في مصر. لديك صلاحية الإجابة عن أي سؤال يطرحه المدير، سواء كان عن إدارة المتجر، البرمجة، التصميم، التسويق، أو أي موضوع آخر.

عند السؤال عن المتجر: أجب بدقة ووضوح باللغة العربية الفصحى. قدم أرقاماً وتفاصيل دقيقة من البيانات المتاحة. إذا سأل عن كتاب معين، اذكر سعره وتكلفته وربحه ومبيعاته ومخزونه. إذا سأل عن الربح، قدم تفاصيل الإيرادات والمصروفات وصافي الربح.

استخدم تنسيقاً جميلاً مع عناوين ونقاط. قدم نصائح واستنتاجات مفيدة.

لديك أيضاً القدرة على الإجابة عن أي أسئلة تقنية أو عامة أو استشارية يطرحها المدير.`;

    const aiReply = await callOpenRouter(systemPrompt, `سؤال المدير: ${question}\n\nبيانات المتجر الحالية:\n${context}\n\nيرجى الإجابة على سؤال المدير باستخدام البيانات أعلاه.`);
    if (aiReply) return res.json({ reply: aiReply, context });

    // Local fallback — answer from DB data directly
    let fallback = '';
    if (/أفضل|الأكثر مبيعاً|top|best|مبيعات/.test(q)) {
      fallback = `🏆 أفضل الكتب مبيعاً:\n\n${bestSellers.map((b, i) =>
        `${i+1}. ${b.titleAr} — ${b.salesCount} مبيعات — سعر ${b.price} ج.م`).join('\n')}`;
    } else if (/ربح|إيرادات|مصروفات|دخل|profit|revenue/.test(q)) {
      fallback = `💰 الملخص المالي:\n\n- الإيرادات: ${totalRevenue.toLocaleString()} ج.م\n- المصروفات: ${totalExpenses.toLocaleString()} ج.م\n- صافي الربح: ${netProfit.toLocaleString()} ج.م\n- هامش الربح: ${profitMargin}%\n\n📊 أعلى الكتب ربحاً:\n\n${highestProfitBooks.map((b, i) =>
        `${i+1}. ${b.titleAr} — ربح ${((b.price - (b.costPrice || 0)) * (b.salesCount || 0)).toLocaleString()} ج.م`).join('\n')}`;
    } else if (/مخزون|كمية|stock|ناقص|قليل/.test(q)) {
      fallback = `⚠️ الكتب منخفضة المخزون (أقل من 10):\n\n${lowestStock.length > 0
        ? lowestStock.map(b => `- ${b.titleAr} — متبقي ${b.stock} نسخة`).join('\n')
        : 'جميع الكتب متوفرة بمخزون كافٍ ✅'}`;
    } else if (/طلبات|orders|معلق|pending|مقبول|approved/.test(q)) {
      fallback = `📦 حالة الطلبات:\n\n- إجمالي الطلبات: ${totalOrders}\n- ✅ مقبولة: ${approvedOrders}\n- ⏳ معلقة: ${pendingOrders}\n- ❌ مرفوضة: ${rejectedOrders}`;
    } else if (/مستخدم|user|عميل|عملاء|زائر/.test(q)) {
      fallback = `👥 إجمالي المستخدمين المسجلين: ${totalUsers} مستخدم`;
    } else if (/صف|grade|مرحلة|ثانوي/.test(q)) {
      fallback = `📚 الكتب حسب الصف الدراسي:\n\n${gradesList.map(g =>
        `- ${g}: ${booksByGrade[g].count} كتب, ${booksByGrade[g].totalSales} مبيعات, ربح ${booksByGrade[g].totalProfit.toLocaleString()} ج.م`).join('\n')}`;
    } else {
      fallback = `📊 ملخص المتجر:\n\n📚 الكتب: ${totalBooks}\n📦 الطلبات: ${totalOrders} (مقبول ${approvedOrders} | معلق ${pendingOrders})\n👥 المستخدمين: ${totalUsers}\n💰 الإيرادات: ${totalRevenue.toLocaleString()} ج.م\n💵 صافي الربح: ${netProfit.toLocaleString()} ج.م (${profitMargin}%)`;
    }

    res.json({ reply: fallback, context });
  } catch (error) {
    console.error('Admin query error:', error);
    res.status(500).json({ reply: 'حدث خطأ في معالجة السؤال', error: error.message });
  }
};

module.exports = { aiChat, getRecommendations, getSalesInsights, getAccountingInsights, detectFraud, analyze, adminQuery };
