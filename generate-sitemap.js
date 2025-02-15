import fs from 'fs';
import path from 'path';

// Baca file graph.json secara manual
const graphDataPath = path.join(process.cwd(), 'src', 'graph.json');
const openGraphData = JSON.parse(fs.readFileSync(graphDataPath, 'utf8'));

// Fungsi untuk menghasilkan sitemap.xml
const generateSitemap = () => {
  const urls = Object.values(openGraphData).map((entry) => entry.url);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  // Simpan sitemap.xml di folder public
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

// Jalankan fungsi
generateSitemap();