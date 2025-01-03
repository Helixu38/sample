import { useState } from "react";

export function usePostApplicant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const postApplicant = async (applicantData: { name: string; age: number; culturalClasses: string[] }) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Reset the success message before posting

    try {
      const response = await fetch("http://localhost:8081/applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicantData),
      });

      if (!response.ok) {
        throw new Error("Failed to create applicant");
      }

      const data = await response.json();
      console.log("Applicant created", data);
      setSuccessMessage("Applicant created successfully!"); // Set success message
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { postApplicant, loading, error, successMessage };
}
    