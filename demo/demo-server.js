const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { nemoMine } = require('../dist/index');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/webminer', (req, res) => {
  res.json({ message: 'Welcome to Nemo WebMiner Demo' });
});

app.post('/webminer', async (req, res) => {
  let { url, selectors, format = 'file' } = req.body;
  if (!url) {
    return res.status(400).send('Missing url');
  }
  if (typeof selectors === 'string' && selectors.trim() === '') {
    selectors = undefined;
  }
  try {
    if (format === 'json') {
      const jsonData = await nemoMine({ url, selectors, format: 'json' });
      res.json(jsonData);
    } else {
      const outfile = path.join(__dirname, 'scraped.xlsx');
      await nemoMine({ url, selectors, output: outfile, format: 'file' });
      res.setHeader('Content-Disposition', 'attachment; filename="scraped.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      fs.createReadStream(outfile).pipe(res);
    }
  } catch (e) {
    res.status(400).json({ error: e.message || 'Scraping failed.' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log('Demo running at http://localhost:' + PORT);
});
