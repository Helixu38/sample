export const fetchApplicants = async () => {
    const API_URL = "http://localhost:8081/applicant";
  
    try {
      const response = await fetch(API_URL);
  
      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }
  
      const applicants = await response.json();
      return applicants;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred while fetching applicants");
      }
    }
  };
  