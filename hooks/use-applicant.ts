"use client";
import { useEffect, useState } from "react";

type CulturalClass = string;

type Applicant = {
  id: number;
  name: string;
  age: number;
  culturalClasses: CulturalClass[];
};

export const useApplicants = () => {
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8081/applicant");
        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }
        const applicants: Applicant[] = await response.json();
        setData(applicants); 
      } catch (err) {
        setError((err as Error).message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();


  }, []);

  return { data, loading, error };
};
