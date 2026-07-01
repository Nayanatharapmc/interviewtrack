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

const sortOptions = [
  {
    label: "Newest first",
    value: "newest",
  },
  {
    label: "Oldest first",
    value: "oldest",
  },
  {
    label: "Company A-Z",
    value: "company",
  },
  {
    label: "Status A-Z",
    value: "status",
  },
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (selectedStatus !== "All") {
        params.status = selectedStatus;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (sort !== "newest") {
        params.sort = sort;
      }

      const response = await api.get("/applications", {
        params,
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
  }, [selectedStatus, sort]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchApplications();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSort("newest");
  };

  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/applications/${applicationId}`);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application._id !== applicationId
        )
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete application.";

      setError(message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Search, filter, and manage your job applications.</p>
        </div>

        <Link className="primary-link-button" to="/applications/new">
          Add Application
        </Link>
      </div>

      <div className="applications-toolbar">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <div className="toolbar-controls">
          <div className="toolbar-control">
            <label>Status</label>
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

          <div className="toolbar-control">
            <label>Sort</label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className="clear-filter-button" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </div>

      <div className="results-summary">
        {!loading && !error && (
          <p>
            Showing <strong>{applications.length}</strong> application
            {applications.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {loading && <p className="info-message">Loading applications...</p>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>Try changing your search or filter options.</p>
          <Link to="/applications/new">Add Application</Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="applications-grid">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;