import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import api from '../api/axios';

const jobTypes = [
    'Full-time',
    'Part-time',
    'Internship',
    'Remote',
    'Contract'
];

const statusOptions = [
    'Applied',
    'HR Interview',
    'Technical Interview',
    'Final Interview',
    'Offered',
    'Rejected',
    'Withdrawn'
];

function EditApplication() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobType: 'Full-time',
        location: '',
        status: 'Applied',
        applicationDate: '',
        jobDescriptionUrl: '',
        notes: ''
    });

    const [pageLoading, setPageLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchApplication = async () => {
        try {
            setPageLoading(true);
            setError('');
            const response = await api.get(`/applications/${id}`);
            const application = response.data.data || response.data;
            setFormData({
                companyName: application.companyName || '',
                jobTitle: application.jobTitle || '',
                jobType: application.jobType || 'Full-time',
                location: application.location || '',
                status: application.status || 'Applied',
                applicationDate: application.applicationDate ? application.applicationDate.substring(0,10) : '',
                jobDescriptionUrl: application.jobDescriptionUrl || '',
                notes: application.notes || ''
        });
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to load application data.';
            setError(message);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!formData.companyName || !formData.jobTitle) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setSubmitLoading(true);
            await api.put(`/applications/${id}`, formData);
            navigate('/applications');
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to update application.';
            setError(message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (pageLoading) {
        return <div>Loading application data...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Edit Application</h1>
                    <p>Update your job application details</p>
                </div>

                <Link className="secondary-link-button" to="/applications">
                    Back to Applications
                </Link>
            </div>
            <form className="application-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-grid">
                    <div className="form-group">
                        <label>Company Name *</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Enter company name"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title *</label>
                        <input
                            type="text"
                            name="jobTitle"
                            placeholder="Enter job title"
                            value={formData.jobTitle}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Type</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                        >
                            {jobTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Application Date</label>
                        <input
                            type="date"
                            name="applicationDate"
                            value={formData.applicationDate}
                            onChange={handleChange}
                        />
                    </div>
                    </div>

                    <div className="form-group">
                        <label>Job Description URL</label>
                        <input
                            type="url"
                            name="jobDescriptionUrl"
                            placeholder="Enter job description URL"
                            value={formData.jobDescriptionUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            rows="4"
                            placeholder="Enter any additional notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={submitLoading}>
                            {submitLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link to="/applications">
                            <button type="button">Cancel</button>
                        </Link>
                    </div>
            </form>
        </div>
    );
}
                
export default EditApplication;