const express = require('express');
const bcrypt = require('bcryptjs');
const { queryOne, run } = require('../db');
const { generateToken } = require('../auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少为6位' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing) {
      return res.status(409).json({ error: '用户名或邮箱已被注册' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const result = await run(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password_hash]
    );

    const user = { id: result.lastInsertRowid, username };
    const token = generateToken(user);

    res.status(201).json({ message: '注册成功', token, user: { id: user.id, username } });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = await queryOne('SELECT * FROM users WHERE username = $1', [username]);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(user);
    res.json({ message: '登录成功', token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
