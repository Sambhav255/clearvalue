import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const hfToken = env.VITE_HF_TOKEN?.trim()

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 700,
    },
    server: {
      proxy: {
        '/api/hf-inference': {
          target: 'https://api-inference.huggingface.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hf-inference/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (hfToken) proxyReq.setHeader('Authorization', `Bearer ${hfToken}`)
            })
          },
        },
        '/api/hf-chat': {
          target: 'https://router.huggingface.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hf-chat/, '/v1/chat/completions'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (hfToken) proxyReq.setHeader('Authorization', `Bearer ${hfToken}`)
              // #region agent log
              fetch('http://127.0.0.1:7549/ingest/3333e265-2fd7-4b40-a746-6557a6836ef1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d3b58'},body:JSON.stringify({sessionId:'4d3b58',runId:'token-auth-check',location:'vite.config.mts:hf-chat:proxyReq',message:'proxy request prepared',data:{hasConfiguredToken:Boolean(hfToken),hasAuthHeader:Boolean(proxyReq.getHeader('authorization'))},timestamp:Date.now(),hypothesisId:'I'})}).catch(()=>{});
              // #endregion
            })
            proxy.on('proxyRes', (proxyRes) => {
              // #region agent log
              fetch('http://127.0.0.1:7549/ingest/3333e265-2fd7-4b40-a746-6557a6836ef1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d3b58'},body:JSON.stringify({sessionId:'4d3b58',runId:'token-auth-check',location:'vite.config.mts:hf-chat:proxyRes',message:'proxy response received',data:{statusCode:proxyRes.statusCode},timestamp:Date.now(),hypothesisId:'J'})}).catch(()=>{});
              // #endregion
            })
          },
        },
      },
    },
  }
})
