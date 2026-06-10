require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const BACKUP_ROOT = path.join(__dirname, '..', 'backups');

async function runBackup() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const backupDir = path.join(BACKUP_ROOT, timestamp);

  fs.mkdirSync(backupDir, { recursive: true });

  let totalSize = 0;

  for (const col of collections) {
    const collection = db.collection(col.name);
    const docs = await collection.find({}).toArray();
    const filePath = path.join(backupDir, col.name + '.json');
    const data = JSON.stringify(docs, null, 2);
    fs.writeFileSync(filePath, data, 'utf-8');
    totalSize += Buffer.byteLength(data, 'utf-8');
  }

  await mongoose.disconnect();

  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log('Backup completed successfully');
  console.log('Path: ' + backupDir);
  console.log('Collections: ' + collections.length);
  console.log('Size: ' + sizeMB + ' MB');
}

runBackup().catch(function (err) {
  console.error('Backup failed: ' + err.message);
  process.exit(1);
});
