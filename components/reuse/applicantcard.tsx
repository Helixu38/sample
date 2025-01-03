import { useState, useEffect } from "react";
import { fetchApplicants } from "@/utils/fetchapplicants";
import dynamic from "next/dynamic";
import { useDeleteApplicant } from "@/hooks/use-delete-applicant"; // Import the delete hook

type Applicant = {
  id: number;
  name: string;
  age: number;
  culturalClasses: string[];
};

const CardWithForm = dynamic(
  () => import("./reusecard").then((mod) => mod.CardWithForm),
  { ssr: false }
);

export const ApplicantList = () => {
  const [data, setData] = useState<Applicant[]>([]); // Store applicants data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deleteApplicant, loading: deleteLoading, error: deleteError, successMessage } = useDeleteApplicant(); // Use delete hook

  // Load applicants only once when the component mounts
  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const applicants = await fetchApplicants();
        setData(applicants); // Set applicants data
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    loadApplicants();
  }, []); // empty dependency array ensures it only runs once (on mount)

  const handleDelete = async (id: string) => {
    await deleteApplicant(Number(id)); // Call delete hook with the id
    setData(data.filter((applicant) => applicant.id.toString() !== id)); // Remove applicant from the list after successful deletion
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No applicants found</div>;

  const formattedUsers = data.map((applicant) => ({
    id: applicant.id.toString(),
    title: `Applicant: ${applicant.name}`,
    content: [
      { label: "Name", value: applicant.name, id: `name-${applicant.id}` },
      { label: "Age", value: applicant.age.toString(), id: `age-${applicant.id}` },
      {
        label: "Cultural Classes",
        value: applicant.culturalClasses?.join(", ") || "None", // Use fallback value if undefined
        id: `cultural-classes-${applicant.id}`,
      },
    ],
    culturalClasses: applicant.culturalClasses || [], // Ensure culturalClasses is always an array
  }));

  return (
    <div>
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <CardWithForm users={formattedUsers} onDelete={handleDelete} />
    </div>
  );
};
