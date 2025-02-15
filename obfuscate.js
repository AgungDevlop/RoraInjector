import { minify } from 'uglify-js';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

// Mendapatkan direktori saat ini menggunakan ES module syntax
const __dirname = new URL('.', import.meta.url).pathname;

// Path ke folder build Vite (setelah npm run build)
const buildPath = resolve(__dirname, 'dist/assets');

// Baca semua file JavaScript di folder build
try {
  const files = readdirSync(buildPath);

  files.forEach((file) => {
    if (file.endsWith('.js')) {
      const filePath = join(buildPath, file);
      const code = readFileSync(filePath, 'utf8');

      const result = minify(code, {
        mangle: {
          toplevel: true, // Mengacak nama variabel dan fungsi di level tertinggi
        },
        compress: {
          dead_code: true, // Menghapus kode mati
          drop_console: true, // Menghapus console.log
          drop_debugger: true, // Menghapus debugger
        },
      });

      if (result.error) {
        console.error(`Error obfuscating ${file}:`, result.error);
      } else {
        writeFileSync(filePath, result.code, 'utf8');
        console.log(`Obfuscated: ${file}`);
      }
    }
  });
} catch (err) {
  console.error('Error reading build directory:', err);
}