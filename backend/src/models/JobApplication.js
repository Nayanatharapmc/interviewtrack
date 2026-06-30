const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Each job application is associated with a specific user
        ref: "User",
        required: true,
    },

    companyName: {
        type: String,
        required: [true, "Please add a company name"],
        trim: true,
    },

    jobTitle: {
        type: String,
        required: [true, "Please add a job title"],
        trim: true,
    },

    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship"],
        default: "Full-time",
    },

    location: {
        type: String,
        default: "Not specified",
        trim: true,
    },

    status: {
        type: String,
        enum: ["Applied", "HR Interview", "Technical Interview", "Final Interview", "Offered", "Rejected", "Withdrawn"],
        default: "Applied",
    },

    applicationDate: {
        type: Date,
        default: Date.now,
    },

    notes: {
        type: String,
        trim: true,
    },  
  },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
