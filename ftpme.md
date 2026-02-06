## 🧠 Database Knowledge Hub: PostgreSQL vs MySQL

If your automated or manual deployment failed at the database step, it is likely because of a **Database Type Mismatch**.

### 1. The Situation
- **Your Project**: Built using **PostgreSQL** (Uses `pg` library, UUIDs, and JSONB).
- **Your Server**: Currently provides **MySQL** (The industry standard for most basic hosting).

### 2. Can they talk to each other?
**No.** PostgreSQL and MySQL are like different languages (e.g., French and Japanese). You cannot simply "upload" a PostgreSQL schema to a MySQL database.

### 3. How to Proceed (Choose a Path)

#### Path A: Enable PostgreSQL (Recommended)
This keeps your code exactly as it is.
1. Log in to your **cPanel**.
2. Search for **"PostgreSQL Databases"**.
3. If it exists, create a database and user there.
4. If it **doesn't** exist, contact your hosting support and ask: *"Can you enable PostgreSQL for my account? My application requires it."*

#### Path B: Convert to MySQL (Advanced)
This requires changing both the **Database Schema** and the **Backend Code**.
- **Schema Changes**: Replace `UUID` with `VARCHAR(36)`, `JSONB` with `JSON`, and `TIMESTAMPTZ` with `DATETIME`.
- **Code Changes**: Replace the `pg` library with `mysql2` and rewrite some query logic.

---

## 🛠 Prerequisites & Tools
- **FTP Client**: [FileZilla](https://filezilla-project.org/) (Recommended).
- **Credentials**:
  - **Host**: `111.118.215.98`
  - **User**: `haspranahealth`
  - **Password**: `R@,sx-UbS)H$`
  - **Port**: `21` (FTP) or `22` (SFTP)
  
> [!IMPORTANT]
> If Port 22 (SFTP) gives an "Authentication Failed" error, it usually means your account only has Port 21 (FTP) enabled. Switch your client to **FTP** (Standard File Transfer Protocol) or Port **21**.
- **Frontend Build Tool**: Node.js and npm installed locally.

---

## 3. Database Deployment

The database cannot be "uploaded" via FTP. You must set it up using the SQL schema provided.

1.  **Create Database on cPanel**:
    - Go to **cPanel -> MySQL Databases** (or PostgreSQL if applicable).
    - Create a new database named `arohan_health_db`.
    - Create a new user and assign them to the database with **ALL PRIVILEGES**.
    - Note down the `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

2.  **Import Schema**:
    - Open **phpMyAdmin** (or pgAdmin equivalent in cPanel).
    - Select your new database.
    - Go to the **Import** tab.
    - Choose the file **`backend/schema.sql`** from your project.
    - Click **Go** to create the tables.

3.  **Update Variables**:
    - Edit the `.env` file you uploaded to the `backend/` folder on the server.
    - Ensure `DATABASE_URL` or individual `DB_` variables match your new cPanel database credentials.

---

## Summary of Folders
- **Frontend Source**: `frontend/`
- **Frontend Build (Upload this)**: `frontend/dist` -> `public_html/`
- **Backend Source**: `backend/`
- **Backend Build (Upload this)**: `backend.zip` -> `backend/`
- **Database Schema**: `backend/schema.sql` (Import via phpMyAdmin)

---

## 🏗 Phase 1: Frontend Deployment (Browser Interface)

The frontend is a React application. You must convert the source code into static files before uploading.

### Step 1.1: Build Locally
1. Open a terminal/command prompt in the `frontend` directory.
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Generate the production build:
   ```bash
   npm run build
   ```
4. This creates a folder named **`dist`** inside the `frontend` directory.

### Step 1.2: Preparation for Routing
Ensure there is a `.htaccess` file inside `frontend/dist`. (I have added one to `frontend/public` which should now be included in the build). This file is critical for React Router to work when you refresh the page.

### Step 1.3: Upload via FTP
1. Open FileZilla and connect using the credentials above.
2. On the **Remote Site** (Right panel), navigate to `/public_html`.
3. On the **Local Site** (Left panel), navigate to your project's `frontend/dist` folder.
4. Select ALL files and folders inside `dist` (Ctrl+A).
5. Right-click and select **Upload**.
6. Overwrite existing files if prompted.

---

## 📦 Phase 2: Backend Deployment (API & Server)

The backend requires a ZIP upload to ensure thousands of small files are handled correctly.

### Step 2.1: Package Locally
1. Run the prepared zipping script in the root directory:
   ```bash
   node zip_backend.js
   ```
2. This creates **`backend.zip`** in your root folder. This ZIP specifically excludes `node_modules` to keep it small (~200KB vs 60MB).

### Step 2.2: Identify Config Files
You also need to upload these two files fresh if they changed:
- `.env` (contains secrets and database URLs)
- `package.json` (contains dependency lists)

### Step 2.3: Upload to Server
1. In FileZilla, navigate to the `/backend` folder on the **Remote Site**.
2. Upload `backend.zip`, `.env`, and `package.json` to this directory.

---

## ⚙️ Phase 3: Finalizing in cPanel

Once files are uploaded, you must extract and restart the server logic.

### Step 3.1: Extracting
1. Log in to your **cPanel**.
2. Open **File Manager**.
3. Go to the `backend` folder.
4. Right-click `backend.zip` and select **Extract**.
5. Wait for the extraction to finish, then delete `backend.zip` to save space.

### Step 3.2: Restarting Node.js
1. In cPanel, search for **"Setup Node.js App"**.
2. Find your application in the list (usually named `arohan` or similar).
3. Click the **Restart** icon (circular arrow).
4. If you added new dependencies, click **"Run JS Install"** (equivalent to `npm install`).

---

## 🆘 Troubleshooting

### 404 Error on Page Refresh
- **Cause**: Missing or incorrect `.htaccess` in `public_html`.
- **Fix**: Ensure the `.htaccess` file in `public_html` contains the "RewriteEngine" rules.

### 500 Internal Server Error (API)
- **Cause**: Missing `.env` file or database connection issue.
- **Fix**: Check that `.env` is present in the `backend` folder and contains the correct `DATABASE_URL`.

### White Screen (Frontend)
- **Cause**: Files partially uploaded or corrupted.
- **Fix**: Re-run `npm run build` and re-upload the entire `dist` folder content.
