import { Link } from "react-router-dom";

function ApplicationCard({ application }) {
  return (
    <div className="application-card">
        <div className="application-card-header">
            <div>
                <h3>{application.companyName}</h3>
                <p>{application.jobTitle}</p>
            </div>

            <span className={`status-badge ${application.status?.replaceAll(" ", "-").toLowerCase()}`}>
                {application.status}
            </span>
        </div>
        <div className="application-details">
            <p>
                <strong>Type:</strong> {application.type}
            </p>
            <p>
                <strong>Location:</strong> {application.location}
            </p>
            <p>
                <strong>Applied on:</strong>{" "} 
                    {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "N/A"}
            </p>
        </div>
        {application.notes && <p className="application-notes"><strong>Notes:</strong> {application.notes}</p>}
        <div className="application-actions">
        <Link to={`/applications/${application._id}/edit`}>Edit</Link>

        {application.jobDescriptionUrl && (
          <a href={application.jobDescriptionUrl} target="_blank" rel="noreferrer">
            View Job
          </a>
        )}
      </div>
    </div>
  );
}

export default ApplicationCard;