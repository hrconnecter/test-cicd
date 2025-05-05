import { useNavigate, useParams } from 'react-router-dom';
import UserProfile from '../../hooks/UserData/useUser';
import React from "react";

const RoleBasedNavigation = () => {
  const navigate = useNavigate();
  const { useGetCurrentRole } = UserProfile();
//   const user = getCurrentUser();
  const role = useGetCurrentRole();
  const { organisationId } = useParams();


  React.useEffect(() => {
    if (role === 'Employee') {
      navigate(`/organisation/${organisationId}/ticket-history`); // Navigate to TicketHistory for employee
    } else if (['HR', "Hr-Admin",'Super-Admin'].includes(role)) {
      navigate(`/organisation/${organisationId}/raised-tickets`); // Navigate to RaisedTickets for HR or Super-Admin
    }
  }, [role, navigate, organisationId]);

  return null; // No UI, just handle navigation
};

export default RoleBasedNavigation;
