import React, { useState } from "react";
import { Button } from "@mui/material";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import { useParams } from "react-router-dom";
import GeoFenceCard from "../SetupPage/SelfieAttendence/GeoFenceCard";
import { fetchFoundationSetup } from "../SetupPage/SelfieAttendence/GeoSelfieTab"; // Import fetchFoundationSetup
import useGetCurrentLocation from "../../hooks/Location/useGetCurrentLocation";
import FoundationModal from "../SetupPage/SelfieAttendence/FoundationModal";
import { useQuery } from "react-query";

const AddGeoFencePage = () => {
  const [openGeoFencing, setOpenGeoFencing] = useState(false);
  const { organisationId } = useParams();
  const { data: locationData } = useGetCurrentLocation();

  const { data: geoData = [] } = useQuery(
    ["geoFencingData", organisationId],
    () => fetchFoundationSetup(organisationId).then((data) => data.geoFencing || []),
    {
      onError: (error) => console.error("Failed to fetch Geo-Fencing data:", error),
    }
  );

  return (
    <BoxComponent>
      <div className="flex justify-between items-center">
        <HeadingOneLineInfo
          heading={"Add Geo Fence"}
          info={"Manage Geo-Fencing zones for your organization."}
        />
        <div className="flex gap-2">
          <Button
            className="!h-fit gap-2 !w-fit"
            variant="contained"
            size="medium"
            onClick={() => setOpenGeoFencing(true)}
          >
            Add Geo Fence
          </Button>
          
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 overflow-auto py-4">
        {geoData.length > 0
          ? geoData.map((item) => (
              <GeoFenceCard
                key={item._id}
                item={item}
              />
            ))
          : "No Geo-Fencing zones have been added yet."}
      </div>
      <ReusableModal
        open={openGeoFencing}
        heading={"Add Geo Fencing"}
        subHeading={"Create a new Geo-Fencing zone for your organization."}
        onClose={() => setOpenGeoFencing(false)}
      >
        <FoundationModal data={locationData}  /> {/* Handle addition */}
      </ReusableModal>
    </BoxComponent>
  );
};

export default AddGeoFencePage;
