import axios from 'axios';

// Function to get HR employees
const getHREmployees = async (organisationId, authToken) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/get-hr/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.employees; // Assuming response contains the employee data in `employees`
  } catch (error) {
    console.error('Error fetching HR employees:', error);
    throw error;
  }
};

export default getHREmployees;
