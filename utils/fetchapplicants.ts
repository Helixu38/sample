export const fetchApplicants = async (pageNo: number, pageSize: number, keyword: string) => {
  const API_URL = `http://localhost:8081/applicant?pageNo=${pageNo}&pageSize=${pageSize}&keyword=${keyword}`;

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
