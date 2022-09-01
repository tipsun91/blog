const router = require('express').Router();
const {
  access,
  AUTHENTICATED,
  UNAUTHENTICATED,
} = require('../../middlewares/access');
const { Comment } = require('../../db/models');
const Pagination = require('../../middlewares/pagination');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const { page, items } = req.query;
      const count = await Comment.count();

      const pagination = new Pagination(count, page, items);

      const [offset, limit] = pagination.getTablePoints();
      const comments = await Comment.findAll({
        raw: true,
        offset,
        limit,
      });

      if (!comments) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      res.status(200).json({ data: comments });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

  router
  .route('/create')
  .post(async (req, res) => {
    try {
      const { text } = req.body;

      const comment = await Comment.create({
        user_id: res.locals.user.id,
        text
      });
      await comment.save();

      res.status(200).json({ status: 'success', message: 'Created!' });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const id = req.params;
      const comment = await Comment.findOne({
        raw: true,
        where: { id }
      });
  
      if (!comment) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }
  
      res.status(200).json({ data: [comment] });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

router
  .route('/:id/update')
  .patch(async (req, res) => {
    try {
      const id = req.params;
      const comment = await Comment.findOneByPk(id);
  
      if (!comment) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      const { text } = req.body;
      await comment.update({ text });
      await comment.save();

      res.status(200).json({ status: 'success', message: 'Saved!' });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

router
  .route('/:id/delete')
  .delete(async (req, res) => {
    try {
      const id = req.params;
      const comment = await Comment.findOneByPk(id);
  
      if (!comment) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      await comment.destroy();

      res.status(200).json({ status: 'success', message: 'Deleted!' });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

module.exports = router;
