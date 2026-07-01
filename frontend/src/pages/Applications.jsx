import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import ApplicationCard from "../components/ApplicationCard";

const statusOptions = [
  "All",
  "Applied",
  "HR Interview",
  "Technical Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications", {
        params: selectedStatus === "All" ? {} : { status: selectedStatus },
      });

      const applicationsData = response.data.data || response.data;

      setApplications(applicationsData);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load applications.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Track your job applications and interview progress.</p>
        </div>

        <Link className="primary-link-button" to="/applications/new">
          Add Application
        </Link>
      </div>

      <div className="filter-section">
        <label>Filter by status</label>

        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="info-message">Loading applications...</p>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>Start by adding your first job application.</p>
          <Link to="/applications/new">Add Application</Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="applications-grid">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;