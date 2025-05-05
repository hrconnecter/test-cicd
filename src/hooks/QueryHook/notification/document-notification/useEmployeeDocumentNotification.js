import { useQuery } from 'react-query';
import axios from 'axios';
import useAuthToken from '../../../Token/useAuth';
import { useParams } from 'react-router-dom';

const useEmployeeDocumentNotification = () => { 
  const authToken = useAuthToken();
  const { organisationId } = useParams();

  // Get document notifications count for the employee
  const { data: documentNotifications, isLoading, error, refetch } = useQuery(
    ['employeeDocumentNotifications', organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs/employee-notifications/count`,
          {
            headers: { Authorization: authToken }
          }
        );
        return response.data;
      } catch (error) {
        // If 404 (no notifications), return 0 count
        if (error.response?.status === 404) {
          return { count: 0 };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken && !!organisationId,
      // Refetch every minute to check for new notifications
      refetchInterval: 60000,
      // Don't refetch on window focus to avoid unnecessary requests
      refetchOnWindowFocus: false
    }
  );

  return {
    documentNotificationCount: documentNotifications?.count || 0,
    isLoading,
    error,
    refetch
  };
};
 
export default useEmployeeDocumentNotification;
 