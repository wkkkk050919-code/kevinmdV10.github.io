const express = require('express');
const { queryAll, queryOne, run } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { content, operation_type } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: '内容不能为空' });
    }

    const result = await run(
      'INSERT INTO user_records (user_id, action_content, operation_type) VALUES ($1, $2, $3) RETURNING id',
      [userId, content, operation_type || 'save']
    );

    res.status(201).json({ id: result.lastInsertRowid, message: '记录保存成功' });
  } catch (err) {
    console.error('保存记录错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const records = await queryAll(
      'SELECT id, action_content, operation_type, created_at FROM user_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const totalRow = await queryOne(
      'SELECT COUNT(*) as count FROM user_records WHERE user_id = $1',
      [userId]
    );

    res.json({ records, total: totalRow ? parseInt(totalRow.count) : 0, limit, offset });
  } catch (err) {
    console.error('获取记录错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;

    const record = await queryOne(
      'SELECT * FROM user_records WHERE id = $1 AND user_id = $2',
      [recordId, userId]
    );
    if (!record) {
      return res.status(404).json({ error: '记录不存在或无权删除' });
    }

    await run('DELETE FROM user_records WHERE id = $1', [recordId]);
    res.json({ message: '记录已删除' });
  } catch (err) {
    console.error('删除记录错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
