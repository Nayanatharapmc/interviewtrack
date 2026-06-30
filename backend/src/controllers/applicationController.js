const JobApplication = require("../models/jobApplication");

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private
const createJobApplication = async (req, res) => {
    try {
        const { companyName, jobTitle, jobType, location, status, applicationDate, notes } = req.body;

        const application = await JobApplication.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all job applications for the logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = { user: req.user.id };
        if (status) {
            filter.status = status;
        }

        const applications = await JobApplication.find(filter).sort({ applicationDate: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Get a single job application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id, 
            user: req.user.id, 
        });

        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Update a job application by ID
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
    try {
        console.log("Update ID:", req.params.id);
        console.log("Logged user:", req.user._id);
        console.log("Update body:", req.body);
        const application = await JobApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            req.body,
            { 
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete a job application by ID
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }

        res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createJobApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
};