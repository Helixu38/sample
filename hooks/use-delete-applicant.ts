import { useState } from "react";

export function useDeleteApplicant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteApplicant = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Reset the success message before deleting

    try {
      const response = await fetch(`http://localhost:8081/applicant/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete applicant");
      }

      const data = await response.json();
      console.log("Applicant deleted", data);
      setSuccessMessage("Applicant deleted successfully!"); // Set success message
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteApplicant, loading, error, successMessage };
}
