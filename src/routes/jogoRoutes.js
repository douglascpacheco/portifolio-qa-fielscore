const express = require('express');
const router = express.Router();
const controller = require('../controllers/jogoController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, controller.create);
router.get('/', controller.list);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
