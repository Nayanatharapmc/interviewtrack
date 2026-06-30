const express = require("express");

const { 
    createJobApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
 } = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
    .route("/")
    .post(protect, createJobApplication)
    .get(protect, getApplications);

router
    .route("/:id")
    .get(protect, getApplicationById)
    .put(protect, updateApplication)
    .delete(protect, deleteApplication);

module.exports = router;