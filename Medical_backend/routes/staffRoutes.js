const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');

// All routes are admin/manager only
router.use(protect, authorize('admin', 'manager'));

router.route('/')
  .get(getStaff)
  .post(createStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
