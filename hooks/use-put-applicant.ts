import { useState } from "react";

export function useUpdateApplicant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateApplicant = async (applicantData: { id: number; name: string; age: number; culturalClasses: string[] }) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Reset the success message before updating

    try {
      const response = await fetch(`http://localhost:8081/applicant`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicantData),
      });

      if (!response.ok) {
        throw new Error("Failed to update applicant");
      }

      const data = await response.json();
      console.log("Applicant updated", data);
      setSuccessMessage("Applicant updated successfully!"); // Set success message
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateApplicant, loading, error, successMessage };
}
