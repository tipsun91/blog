const router = require('express').Router();
const {
  access,
  AUTHENTICATED,
  UNAUTHENTICATED,
} = require('../../middlewares/access');
const { Post } = require('../../db/models');
const Pagination = require('../../middlewares/pagination');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const { page, items } = req.query;
      const count = await Post.count();

      const pagination = new Pagination(count, page, items);

      const [offset, limit] = pagination.getTablePoints();
      const posts = await Post.findAll({
        raw: true,
        offset,
        limit,
      });

      if (!posts) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      res.status(200).json({ data: posts });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

  router
  .route('/create')
  .post(async (req, res) => {
    try {
      const { text } = req.body;

      const post = await Post.create({
        user_id: res.locals.user.id,
        text
      });
      await post.save();

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
      const post = await Post.findOne({
        raw: true,
        where: { id }
      });
  
      if (!post) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }
  
      res.status(200).json({ data: [post] });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

router
  .route('/:id/update')
  .patch(async (req, res) => {
    try {
      const id = req.params;
      const post = await Post.findOneByPk(id);
  
      if (!post) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      const { text } = req.body;
      await post.update({ text });
      await post.save();

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
      const post = await Post.findOneByPk(id);
  
      if (!post) {
        res.status(404).json({ status: 'error', message: 'Not found!' });
        return;
      }

      await post.destroy();

      res.status(200).json({ status: 'success', message: 'Deleted!' });
    } catch(e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

module.exports = router;
