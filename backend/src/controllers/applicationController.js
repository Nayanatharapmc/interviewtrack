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

// @desc    Get all job applications of logged-in user with search, filter, and sort
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    try {
        const { status, search, sort } = req.query;

        const filter = {
            user: req.user._id,
        };

        // Filter by status
        if (status && status !== "All") {
            filter.status = status;
        }

        // Search by company name or job title
        if (search) {
            filter.$or = [
                {
                    companyName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    jobTitle: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Sort options
        let sortOption = { createdAt: -1 };

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        if (sort === "company") {
            sortOption = { companyName: 1 };
        }

        if (sort === "status") {
            sortOption = { status: 1 };
        }

        const applications = await JobApplication.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
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

// @desc   Get dashboard summary for the logged-in user
// @route  GET /api/applications/summary
// @access Private
const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const total = await JobApplication.countDocuments({ user: userId });
        const applied = await JobApplication.countDocuments({ user: userId, status: 'Applied' });
        const interviews = await JobApplication.countDocuments({ 
            user: userId, 
            status: { 
                $in: ['HR Interview', 'Technical Interview', 'Final Interview'] 
            } 
        });
        const offers = await JobApplication.countDocuments({ user: userId, status: 'Offered' });
        const rejected = await JobApplication.countDocuments({ user: userId, status: 'Rejected' });
        
        res.status(200).json({
            success: true,
            data: {
                total,
                applied,
                interviews,
                offers,
                rejected
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
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
    getDashboardSummary,
};