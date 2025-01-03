import { useState } from "react";
import dynamic from "next/dynamic";
import { useDeleteApplicant } from "@/hooks/use-delete-applicant"; // Import the delete hook
import { useRefreshApplicants } from "@/hooks/use-refresh-applicant";
import ReuseButton from "./button"; // Import your custom ReuseButton component

const CardWithForm = dynamic(
  () => import("./reusecard").then((mod) => mod.CardWithForm),
  { ssr: false }
);

export const ApplicantList = () => {
  const { applicants, loading, error, refetchApplicants } = useRefreshApplicants(); 
  const { deleteApplicant, loading: deleteLoading, error: deleteError, successMessage } = useDeleteApplicant();

  // State for controlling the visibility of the confirmation dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    // Set the selected applicant ID and open the confirmation dialog
    setSelectedApplicantId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedApplicantId) {
      await deleteApplicant(Number(selectedApplicantId));
      refetchApplicants(); // Refresh the list after deletion
      setIsDialogOpen(false); // Close the dialog
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false); // Close the dialog without deleting
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (applicants.length === 0) return <div>No applicants found</div>;

  const formattedUsers = applicants.map((applicant) => ({
    id: applicant.id.toString(),
    title: `Applicant: ${applicant.name}`,
    content: [
      { label: "Name", value: applicant.name, id: `name-${applicant.id}` },
      { label: "Age", value: applicant.age.toString(), id: `age-${applicant.id}` },
      {
        label: "Cultural Classes",
        value: applicant.culturalClasses?.join(", ") || "None",
        id: `cultural-classes-${applicant.id}`,
      },
    ],
    culturalClasses: applicant.culturalClasses || [],
  }));

  // Find the name of the selected applicant by ID
  const selectedApplicantName = selectedApplicantId
    ? applicants.find((applicant) => applicant.id.toString() === selectedApplicantId)?.name
    : null;

  return (
    <div>
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      
      {/* Display confirmation dialog if it's open */}
      {isDialogOpen && selectedApplicantName && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h3>Are you sure you want to delete {selectedApplicantName}?</h3>
            <div className="flex justify-end space-x-4 mt-4">
              <ReuseButton
                title="Cancel"
                color="gray"
                onClick={cancelDelete}
              />
              <ReuseButton
                title="Confirm"
                color="red"
                onClick={confirmDelete}
              />
            </div>
          </div>
        </div>
      )}

      <CardWithForm users={formattedUsers} onDelete={handleDelete} />
    </div>
  );
};
