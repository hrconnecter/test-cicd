import React from "react";
import PunchAcceptModal from "../../components/Modal/RemotePunchingModal/PunchAcceptModal";

const PunchNotification = ({ filterOrgId, filterOrgData, isLoading }) => {

  return (
    <div>
      <PunchAcceptModal filterOrgId={filterOrgId} filterOrgData={filterOrgData} isLoading={isLoading} />
    </div>
  );
};

export default PunchNotification;
