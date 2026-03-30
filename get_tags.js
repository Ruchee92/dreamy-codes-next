const https = require('https');

https.get('https://dreamycodes.com', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const metas = data.match(/<meta[^>]*>/g) || [];
    const fbOg = metas.filter(m => /property=["'](og:|fb:)/.test(m) || /name=["'](og:|fb:)/.test(m));
    console.log(fbOg.join('\n'));
  });
});
