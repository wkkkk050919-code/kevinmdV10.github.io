const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const recordsRoutes = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', authRoutes);
app.use('/api/records', recordsRoutes);

app.use(express.static(path.join(__dirname, '..')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Kevin MD 服务已启动 (PostgreSQL): http://0.0.0.0:${PORT}`);
      console.log(`前端页面: http://0.0.0.0:${PORT}/kevinmd.html`);
    });
  })
  .catch((err) => {
    console.error('数据库初始化失败，服务未启动:', err.message);
    process.exit(1);
  });
