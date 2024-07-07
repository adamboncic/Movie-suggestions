const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const files = fs.readdirSync(distPath);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(distPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('__API_KEY__', process.env.VITE_TMDB_API_KEY);
    content = content.replace('__ACCESS_TOKEN__', process.env.VITE_TMDB_ACCESS_TOKEN);
    fs.writeFileSync(filePath, content);
  }
});