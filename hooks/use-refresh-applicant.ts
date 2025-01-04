import { useState, useEffect } from "react";
import { fetchApplicants } from "@/utils/fetchapplicants";

type Applicant = {
  id: number;
  name: string;
  age: number;
  culturalClasses: string[];
};

export const useRefreshApplicants = (pageNo: number, pageSize: number, keyword: string) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchApplicants = async () => {
    setLoading(true);
    try {
      const applicantsData = await fetchApplicants(pageNo, pageSize, keyword);
      setApplicants(applicantsData.content); // Assuming 'content' contains the applicants array
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
    refetchApplicants(); // Fetch applicants whenever pageNo, pageSize, or keyword changes
  }, [pageNo, pageSize, keyword]);

  return {
    applicants,
    loading,
    error,
    refetchApplicants,
  };
};
