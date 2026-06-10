require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const backupScript = path.join(__dirname, 'backup.js');

cron.schedule('0 2 * * *', function () {
  console.log('[AutoBackup] Starting scheduled backup at ' + new Date().toISOString());
  exec('node "' + backupScript + '"', { stdio: 'inherit' }, function (err, stdout, stderr) {
    if (err) {
      console.error('[AutoBackup] Backup failed: ' + err.message);
      return;
    }
    console.log('[AutoBackup] Backup completed successfully');
  });
});

console.log('Auto-backup scheduler started — daily at 2:00 AM');

process.on('uncaughtException', function (err) {
  console.error('Uncaught exception: ' + err.message);
});

process.on('unhandledRejection', function (reason) {
  console.error('Unhandled rejection: ' + (reason ? reason.message : ''));
});
