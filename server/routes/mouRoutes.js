const express = require('express');
const router = express.Router();
const MoU = require('../models/MoU');
const auth = require('../middleware/auth');

// @route    POST /api/mou/register
// @desc     Step 1-6: Initiation to Draft (Create new)
router.post('/register', auth, async (req, res) => {
  try {
    const newMoU = new MoU({
      ...req.body,
      createdBy: req.user.id, // ID from the JWT token
      currentStep: 1,
      status: 'Draft'
    });
    const savedMoU = await newMoU.save();
    res.status(201).json(savedMoU);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route    PUT /api/mou/update/:id
// @desc     Quick Edit: Modify Status and Lifecycle Step
router.put('/update/:id', auth, async (req, res) => {
  try {
    // SECURITY: Only Admin or Executive can perform quick status changes
    if (!['admin', 'executive'].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access Denied: Insufficient Permissions" });
    }

    const { status, currentStep } = req.body;
    
    const updatedMoU = await MoU.findByIdAndUpdate(
      req.params.id,
      { $set: { status, currentStep, lastModifiedBy: req.user.id } },
      { new: true }
    );

    if (!updatedMoU) return res.status(404).json({ msg: "MoU not found" });
    
    res.json(updatedMoU);
  } catch (err) {
    res.status(500).json({ message: "Error updating registry entry" });
  }
});

// @route    PATCH /api/mou/sign/:id
// @desc     Step 7: Official Signing & Activation (Executive Only)
router.patch('/sign/:id', auth, async (req, res) => {
  try {
    // Only Executives can officially sign off on a partnership
    if (req.user.role !== 'executive' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized: Only Executives can sign MoUs' });
    }

    const updatedMoU = await MoU.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: 'Active', 
          currentStep: 7, 
          signingDate: Date.now(),
          'workflow.step7Status': 'Completed' 
        } 
      },
      { new: true }
    );
    res.json(updatedMoU);
  } catch (err) {
    res.status(500).json({ message: "Error during signing phase" });
  }
});

// @route    GET /api/mou/all
// @desc     Fetch registry with search/filter capabilities
router.get('/all', auth, async (req, res) => {
  try {
    // Sort by most recently updated so new entries appear at the top
    const mous = await MoU.find().sort({ updatedAt: -1 });
    res.json(mous);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registry" });
  }
});

// @route    DELETE /api/mou/:id
// @desc     Admin Only: Remove an MoU from the registry
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Only System Admins can delete records" });
    }
    await MoU.findByIdAndDelete(req.params.id);
    res.json({ msg: "MoU successfully removed from registry" });
  } catch (err) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

module.exports = router;