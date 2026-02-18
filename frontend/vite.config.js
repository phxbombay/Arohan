import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

// Custom plugin to inject critical scripts BEFORE Vite's polyfill injection
function criticalScriptsPlugin() {
  return {
    name: 'inject-critical-scripts',
    enforce: 'post', // Run after all other plugins
    transformIndexHtml(html) {
      const criticalScript = `
<script>
// NUCLEAR: Kill all service workers and caches FIRST
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(reg){reg.unregister()})});if('caches' in window){caches.keys().then(function(n){n.forEach(function(name){caches.delete(name)})})}}
// ERROR TRAP: Catch ALL errors including module errors
window.addEventListener('error',function(e){document.title='ERR:'+e.message;document.body.style.background='#ff6';document.body.innerHTML='<pre style=\"padding:20px;font-size:14px;word-wrap:break-word\">ERROR: '+e.message+'\\nFile: '+(e.filename||'?')+'\\nLine: '+(e.lineno||'?')+'\\n\\nIf you see this, screenshot it and send to the developer.</pre>'+document.body.innerHTML});
window.addEventListener('unhandledrejection',function(e){var m=e.reason?(e.reason.message||String(e.reason)):'unknown';document.title='ERR:'+m;document.body.style.background='#ff6';document.body.innerHTML='<pre style=\"padding:20px;font-size:14px;word-wrap:break-word\">PROMISE ERROR: '+m+'</pre>'+document.body.innerHTML});
</script>`;
      // Insert right after <head> opening tag, BEFORE anything else
      return html.replace('<head>', '<head>' + criticalScript);
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // criticalScriptsPlugin(), // Removed aggressive error trap
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true, // Polyfill modern browsers (iOS 11-13)
    })
  ],

  build: {
    // Code splitting and optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-motion': ['framer-motion', 'motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    minify: true,
    // Enable CSS code splitting
    cssCodeSplit: true,
    target: 'es2015', // Fix for iOS compatibility
    sourcemap: false,
  },

  server: {
    port: 5174, // Frontend port
    proxy: {
      '/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material'],
  },
})
