import { useState, useEffect } from "react";
import { fetchApplicants } from "@/utils/fetchapplicants";

type Applicant = {
  id: number;
  name: string;
  age: number;
  culturalClasses: string[];
};

export const useRefreshApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch applicants
  const refetchApplicants = async () => {
    setLoading(true);
    try {
      const applicantsData = await fetchApplicants();
      setApplicants(applicantsData);
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
    refetchApplicants(); 
  }, []);

  return {
    applicants,
    loading,
    error,
    refetchApplicants,  
  };
};
