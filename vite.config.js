import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     server: {
//         port: 80,
//         proxy: {
//             '/api': {
//                 target: 'http://localhost:5000',
//                 changeOrigin: true,
//                 secure: false,
//             },
//         },
//     },
// });
export default defineConfig({
  plugins: [react()],
  server: {
    port: 443,
    proxy: {
      '/api': {
        target: 'https://erp.yes-electronics.com',
        changeOrigin: true,
        secure: false,
      },
    }
}
})
