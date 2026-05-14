/**
 * Admin User Seeder
 * Run: node scripts/seed-admin.mjs
 *
 * This creates an admin user in your MongoDB database.
 * Make sure your .env.local file has MONGODB_URI set correctly before running.
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manually load .env.local
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
} catch {
  console.error('❌ Could not read .env.local — make sure it exists in the project root.');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI || MONGODB_URI.includes('YOUR_USERNAME')) {
  console.error('❌ MONGODB_URI is not set or still has placeholder values in .env.local');
  process.exit(1);
}

// --- Admin Credentials (change these!) ---
const ADMIN_NAME     = 'GS Admin';
const ADMIN_EMAIL    = 'admin@gscanvas.com';
const ADMIN_PASSWORD = 'Admin@123456';
// -----------------------------------------

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String },
  role:      { type: String, enum: ['admin', 'customer'], default: 'customer' },
  status:    { type: String, enum: ['active', 'blocked'], default: 'active' },
}, { timestamps: true });

async function seed() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!');

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
    status: 'active',
  });

  console.log('');
  console.log('🎉 Admin user created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👉 Login at: http://localhost:3000/admin/login');
  console.log('');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
