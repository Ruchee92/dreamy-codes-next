const https = require('https');
const fs = require('fs');

https.get('https://dreamycodes.com', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const headMatch = data.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    let output = '';
    if (headMatch) {
      const head = headMatch[1];
      const metas = head.match(/<meta[^>]*>/g) || [];
      output += '=== ALL META TAGS IN <head> ===\n';
      metas.forEach(m => output += m + '\n');
      output += '\n=== LOOKING FOR og:url, fb:app_id, og:image ===\n';
      const targets = metas.filter(m => 
        m.includes('og:url') || m.includes('fb:app_id') || m.includes('og:image')
      );
      if (targets.length === 0) {
        output += 'NONE FOUND!\n';
      } else {
        targets.forEach(m => output += m + '\n');
      }
    }
    fs.writeFileSync('meta_output.txt', output);
    console.log('Done! Check meta_output.txt');
  });
});
