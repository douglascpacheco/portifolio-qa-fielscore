const express = require('express');
const router = express.Router();
const controller = require('../controllers/torcedorController');
const { authenticate } = require('../middleware/auth');

router.post('/', controller.create);
router.get('/', authenticate, controller.list);
router.get('/:nr_ft', authenticate, controller.get);
router.delete('/:nr_ft', authenticate, controller.delete);

module.exports = router;
