# Manual FTP Deployment Guide

Follow these steps to manually update your Arohan Health application on the FTP server.

## 1. Frontend Deployment

The frontend consists of static files. You must build them locally first.

1.  **Build Locallly**:
    ```bash
    cd frontend
    npm install
    npm run build
    ```
2.  **Upload**:
    - Open your FTP client (e.g., FileZilla, WinSCP, or cPanel File Manager).
    - Navigate to the `public_html` directory on the server.
    - Upload all files and folders from your local `frontend/dist` directory into the server's `public_html`.
    - **Note**: Ensure the `.htaccess` file (if present) is also uploaded to handle client-side routing.

## 2. Backend Deployment

The backend requires a ZIP upload for efficiency and to preserve the folder structure.

1.  **Package Locally**:
    - Zip the `backend` folder. **EXCLUDE `node_modules`** to keep the file size small.
    - Alternatively, use the provided script:
      ```bash
      node zip_backend.js
      ```
    - This creates `backend.zip` in your root folder.

2.  **Upload Files**:
    - Navigate to the **root** or a specific `backend/` directory on the server (parallel to `public_html`).
    - Upload `backend.zip`, `.env`, and `package.json`.

3.  **Extract & Finalize**:
    - Log in to **cPanel File Manager**.
    - Find `backend.zip` in the `backend/` folder.
    - Right-click and choose **Extract**.
    - **Restart the Node.js application** from your cPanel's "Setup Node.js App" section.

## Summary of Folders
- **Frontend Source**: `frontend/`
- **Frontend Build (Upload this)**: `frontend/dist` -> `public_html/`
- **Backend Source**: `backend/`
- **Backend Build (Upload this)**: `backend.zip` -> `backend/`
