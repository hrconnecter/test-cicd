import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrganizationProfile.css"; // Import external CSS
import { useQuery } from "react-query";
import OpenJobPositionHiring from "../../../pages/Hiring/OpenRoleJobPosition";
function OrganizationProfile() {
  const { organisationId } = useParams();

  const {
    data: dataDashboard,
    isLoading,
    error,
  } = useQuery(
    ["organizationData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-dashboard/hiring`
      );
      return response?.data?.data;
    },
    {
      enabled: !!organisationId, // Ensures the query runs only if organisationId exists
    }
  );
  console.log("dataDashboard", dataDashboard);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="container">
      {/* Company Info Section */}
      <div className="card company-card">
        <div className="company-profile">
          <div className="company-logo">
            {dataDashboard?.logo_url ? (
              <img
                src={dataDashboard.logo_url}
                alt="Company Logo"
                className="logo-image"
              />
            ) : (
              ""
            )}
          </div>
          <div className="company-info">
            <p className="company-name">
              {dataDashboard?.companyName || "Company Name"}
            </p>
            <p>{dataDashboard?.address || "Address"}</p>
            <p>{dataDashboard?.contact || "Contact Info"}</p>
            <p>{dataDashboard?.email}</p>
            <p>
              Website:{" "}
              {dataDashboard?.website ? (
                <a
                  href={dataDashboard.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {dataDashboard.website}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
        <div className="powered-by">Powered by Aegis HRMS software</div>
      </div>

      {/* About Us Section */}
      <div className="card about-card">
        <div className="card-header">
          <h2 className="section-title">About Us:</h2>
        </div>
        <div className="card-content">
          {/* <div className="input-field">
            <p>Image or video about company (Uploaded by them)</p>
          </div> */}
          <div className="input-field">
            <p>{dataDashboard?.description || "No details available."}</p>
          </div>
        </div>
      </div>

      {/* Job Opening Section */}
      <div className="card job-card">
        <div className="card-header">
          <h2 className="section-title">Job Openings:</h2>
        </div>
        <div>
          <OpenJobPositionHiring external={"external"} />
        </div>
      </div>
    </div>
  );
}

export default OrganizationProfile;
