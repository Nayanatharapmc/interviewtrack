import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications");

      const applicationsData = response.data.data || response.data;

      setApplications(applicationsData);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load dashboard data.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const interviewCount = applications.filter((application) =>
    ["HR Interview", "Technical Interview", "Final Interview"].includes(
      application.status
    )
  ).length;

  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const recentApplications = applications.slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}. Here is your application summary.</p>
        </div>

        <Link className="primary-link-button" to="/applications/new">
          Add Application
        </Link>
      </div>

      {loading && <p className="info-message">Loading dashboard...</p>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{totalApplications}</h3>
              <p>Total Applications</p>
            </div>

            <div className="stat-card">
              <h3>{appliedCount}</h3>
              <p>Applied</p>
            </div>

            <div className="stat-card">
              <h3>{interviewCount}</h3>
              <p>Interview Stage</p>
            </div>

            <div className="stat-card">
              <h3>{offerCount}</h3>
              <p>Offers</p>
            </div>

            <div className="stat-card">
              <h3>{rejectedCount}</h3>
              <p>Rejected</p>
            </div>
          </div>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <Link to="/applications">View all</Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="empty-state">
                <h3>No applications yet</h3>
                <p>Add your first job application to see dashboard insights.</p>
                <Link to="/applications/new">Add Application</Link>
              </div>
            ) : (
              <div className="recent-list">
                {recentApplications.map((application) => (
                  <div key={application._id} className="recent-item">
                    <div>
                      <h4>{application.companyName}</h4>
                      <p>{application.jobTitle}</p>
                    </div>

                    <span className="small-status">{application.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;