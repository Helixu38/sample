import { useState, useEffect } from "react";
import { fetchApplicants } from "@/utils/fetchapplicants";

type Applicant = {
  id: number;
  name: string;
  age: number;
  culturalClasses: string[];
};

export const useRefreshApplicants = (pageNo: number, pageSize: number) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch applicants with pagination
  const refetchApplicants = async () => {
    setLoading(true);
    try {
      const applicantsData = await fetchApplicants(pageNo, pageSize);
      setApplicants(applicantsData.content); // assuming 'content' is the array of applicants
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchApplicants(); // Fetch applicants when pageNo or pageSize changes
  }, [pageNo, pageSize]);

  return {
    applicants,
    loading,
    error,
    refetchApplicants,
  };
};
