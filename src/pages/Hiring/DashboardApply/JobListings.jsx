"";

import { useState } from "react";

function JobListings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    setIsLoggedIn(true);
  };

  const jobListings = [
    {
      id: 1,
      title: "Software Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York",
      type: "Full-time",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco",
      type: "Contract",
    },
  ];

  const openApplyDialog = (job) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
          }
          
          .card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 1rem;
            overflow: hidden;
          }
          
          .card-header {
            padding: 1rem;
            border-bottom: 1px solid #eee;
          }
          
          .card-title {
            font-size: 1.125rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
          }
          
          .card-subtitle {
            font-size: 0.875rem;
            color: #666;
          }
          
          .card-content {
            padding: 1rem;
          }
          
          .card-footer {
            padding: 1rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
          }
          
          .tabs {
            width: 100%;
          }
          
          .tab-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 1rem;
          }
          
          .tab-button {
            padding: 0.5rem;
            background: none;
            border: none;
            border-bottom: 2px solid #eee;
            cursor: pointer;
          }
          
          .tab-button.active {
            border-bottom: 2px solid #4a7aff;
            font-weight: bold;
          }
          
          .form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding-top: 1rem;
          }
          
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .form-label {
            font-weight: bold;
            font-size: 0.875rem;
          }
          
          .form-input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          
          .button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          }
          
          .primary-button {
            background-color: #4a7aff;
            color: white;
          }
          
          .secondary-button {
            background-color: transparent;
            border: 1px solid #ccc;
          }
          
          .full-width {
            width: 100%;
          }
          
          .job-listings {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .job-title {
            font-size: 1.125rem;
            font-weight: bold;
          }
          
          .job-meta {
            font-size: 0.875rem;
            color: #666;
          }
          
          .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .dialog {
            background-color: white;
            border-radius: 4px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .dialog-header {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            position: relative;
          }
          
          .dialog-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
          }
          
          .dialog-subtitle {
            font-size: 0.875rem;
            color: #666;
          }
          
          .dialog-content {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .dialog-footer {
            padding: 1rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
          }
          
          .close-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
          }
        `}
      </style>

      <h2 className="page-title">Job Openings</h2>

      {!isLoggedIn ? (
        <div className="card login-card">
          <div className="card-header">
            <h3 className="card-title">Login Required</h3>
            <p className="card-subtitle">
              Please login or create an account to view job openings
            </p>
          </div>
          <div className="card-content">
            <div className="tabs">
              <div className="tab-list">
                <button
                  className={`tab-button ${
                    activeTab === "login" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "register" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>

              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="button primary-button full-width"
                  >
                    Login
                  </button>
                </form>
              )}

              {activeTab === "register" && (
                <form className="form">
                  <div className="form-group">
                    <label htmlFor="register-email" className="form-label">
                      Email
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-password" className="form-label">
                      Password
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="form-input"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="button primary-button full-width"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="job-listings">
          {jobListings.map((job) => (
            <div key={job.id} className="card job-card">
              <div className="card-header">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-meta">
                  {job.department} • {job.location} • {job.type}
                </p>
              </div>
              <div className="card-footer">
                <button
                  className="button primary-button"
                  onClick={() => openApplyDialog(job)}
                >
                  Apply
                </button>
                <button className="button secondary-button">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showApplyDialog && selectedJob && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Apply for {selectedJob.title}</h2>
              <p className="dialog-subtitle">
                Fill out the application form for this position.
              </p>
              <button
                className="close-button"
                onClick={() => setShowApplyDialog(false)}
              >
                &times;
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input id="name" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="resume" className="form-label">
                  Resume
                </label>
                <input id="resume" type="file" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="cover" className="form-label">
                  Cover Letter
                </label>
                <input id="cover" type="file" className="form-input" />
              </div>
            </div>
            <div className="dialog-footer">
              <button className="button primary-button">
                Submit Application
              </button>
              <button
                className="button secondary-button"
                onClick={() => setShowApplyDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobListings;
