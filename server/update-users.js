const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  // Update admin password
  await User.findOneAndUpdate(
    { email: 'admin@bookbeacon.com' },
    { password: 'BB_Admin@2026!Secure', isVerified: true, role: 'admin' }
  );
  console.log('Admin password updated');

  // Create cashier if not exists
  const cashierExists = await User.findOne({ email: 'cashier@bookbeacon.com' });
  if (!cashierExists) {
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
    console.log('Cashier already exists');
  }

  console.log('Done!');
  process.exit(0);
})();
