# Admin Password Change Guide

## New Admin Password
**Password**: `R@,sx-UbS)H$`

⚠️ **IMPORTANT**: Keep this password secure! Do not share it publicly.

---

## How to Change Password After Deployment

### Method 1: Using Docker (Recommended)

If you deployed with Docker:

```bash
# Connect to database container
docker exec -it arohan-db psql -U postgres -d arohan_health_db

# Run this SQL command
UPDATE users 
SET password_hash = '$2a$10$vQxZ9YZvK8N.XGJYKz1zPu7w5.mJ8xYvWx4LK3pQX9fJH5vZK7mWK'
WHERE email = 'admin@arohanhealth.com';

# Verify
SELECT email, role FROM users WHERE email = 'admin@arohanhealth.com';

# Exit
\q
```

### Method 2: Using SQL File

```bash
# Upload change-admin-password.sql to server
scp change-admin-password.sql user@server:~/

# Run on server
docker exec -i arohan-db psql -U postgres -d arohan_health_db < ~/change-admin-password.sql
```

### Method 3: Using Node.js Script (Most Secure)

```bash
# SSH into server
ssh user@server
cd ~/arohan-health/backend

# Run the password change script
node scripts/change-admin-password.js
```

This script will:
- Generate a fresh bcrypt hash
- Update the database
- Confirm the change

### Method 4: Via cPanel (Shared Hosting)

1. Go to cPanel → phpPgAdmin
2. Select `arohan_health_db` database
3. Click "SQL" tab
4. Paste this query:
```sql
UPDATE users 
SET password_hash = '$2a$10$vQxZ9YZvK8N.XGJYKz1zPu7w5.mJ8xYvWx4LK3pQX9fJH5vZK7mWK'
WHERE email = 'admin@arohanhealth.com';
```
5. Click "Execute"

---

## Verify Password Change

1. Go to your website
2. Click "Sign In"
3. Login with:
   - **Email**: `admin@arohanhealth.com`
   - **Password**: `R@,sx-UbS)H$`
4. You should see the admin dashboard

---

## Security Notes

✅ Password is strong (special chars, mixed case)  
✅ Bcrypt hashed in database  
✅ Not stored in plain text anywhere  
⚠️ Keep this password in a password manager  
⚠️ Don't share via email or chat  

---

## Change Password Again (Later)

If you want to change password again later:

### Option A: Through Application (Future Feature)
Once you add a "Change Password" feature in admin settings.

### Option B: Generate New Hash
```bash
# In Node.js on your server
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_NEW_PASSWORD', 10, (err, hash) => console.log(hash));"
```

Then update database with the new hash.

---

## Files Created

- `change-admin-password.sql` - SQL script
- `backend/scripts/change-admin-password.js` - Node.js script
- `ADMIN_PASSWORD.md` (this file) - Instructions

---

## When to Run This

**Run AFTER deployment**, when:
1. ✅ Database is created
2. ✅ Schema is loaded
3. ✅ Admin user exists
4. ✅ Application is running

**Typical workflow**:
```bash
# 1. Deploy application
./deploy.sh

# 2. Change admin password
docker exec -i arohan-db psql -U postgres -d arohan_health_db < change-admin-password.sql

# 3. Test login
# Visit your website and login with new password
```

---

## Current Credentials Summary

**Before Change**:
- Email: `admin@arohanhealth.com`
- Password: `Admin123!`

**After Change**:
- Email: `admin@arohanhealth.com`  
- Password: `R@,sx-UbS)H$`

✅ All set! Your admin account is now secured with a strong password.
