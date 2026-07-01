import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

function AddApplication() {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setLoading(true);
            await api.post('/applications', formData);
            navigate('/applications');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add application.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='page-header'>
                <div>
                    <h1>Add Application</h1>
                    <p>Add a new job application to track your progress.</p>
                </div>
                <Link className='secondary-link-button' to='/applications'>
                    Back to Applications
                </Link>
            </div>

            <form className='application-form' onSubmit={handleSubmit}>
                 {error && <div className="error-message">{error}</div>}
                
                <div className='form-grid'>
                    <div className='form-group'>
                        <label>Company Name *</label>
                        <input
                            type='text'
                            name='companyName'
                            placeholder='Enter company name'
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Job Title *</label>
                        <input
                            type='text'
                            name='jobTitle'
                            placeholder='Enter job title'
                            value={formData.jobTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Job Type</label>
                        <select
                            name='jobType'
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

                    <div className='form-group'>
                        <label>Status</label>
                        <select
                            name='status'
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Location</label>
                        <input
                            type='text'
                            name='location'
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Application Date</label>
                        <input
                            type='date'
                            name='applicationDate'
                            value={formData.applicationDate}
                            onChange={handleChange}
                        />
                    </div>
                    </div>

                    <div className='form-group'>
                        <label>Job Description URL</label>
                        <input
                            type='url'
                            name='jobDescriptionUrl'
                            placeholder='Enter job description URL'
                            value={formData.jobDescriptionUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Notes</label>
                        <textarea
                            name='notes'
                            rows='4'
                            placeholder='Enter any additional notes'
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-actions'>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Adding...' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }        

export default AddApplication;