import { useState } from "react";
import dynamic from "next/dynamic";
import { useDeleteApplicant } from "@/hooks/use-delete-applicant";
import { useRefreshApplicants } from "@/hooks/use-refresh-applicant";
import ReuseButton from "./button";

const CardWithForm = dynamic(
  () => import("./reusecard").then((mod) => mod.CardWithForm),
  { ssr: false }
);

export const ApplicantList = () => {
  const [pageNo, setPageNo] = useState(0); // Track the current page number
  const pageSize = 5; // Number of applicants per page
  const [keyword, setKeyword] = useState(""); // Track the search keyword

  // Fetch applicants with pagination and search
  const { applicants, loading, error, refetchApplicants } = useRefreshApplicants(pageNo, pageSize, keyword);
  const { deleteApplicant, successMessage } = useDeleteApplicant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setSelectedApplicantId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedApplicantId) {
      await deleteApplicant(Number(selectedApplicantId));
      refetchApplicants(); // Refetch applicants after deleting
      setIsDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value); // Update the search keyword
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

  const selectedApplicantName = selectedApplicantId
    ? applicants.find((applicant) => applicant.id.toString() === selectedApplicantId)?.name
    : null;

  // Pagination controls
  const handleNextPage = () => setPageNo((prev) => prev + 1);
  const handlePrevPage = () => setPageNo((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div>
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search applicants..."
          value={keyword}
          onChange={handleSearchChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Display confirmation dialog if it's open */}
      {isDialogOpen && selectedApplicantName && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h3>Are you sure you want to delete {selectedApplicantName}?</h3>
            <div className="flex justify-end space-x-4 mt-4">
              <ReuseButton title="Cancel" color="gray" onClick={cancelDelete} />
              <ReuseButton title="Confirm" color="red" onClick={confirmDelete} />
            </div>
          </div>
        </div>
      )}

      <CardWithForm users={formattedUsers} onDelete={handleDelete} />

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between">
        <ReuseButton title="Previous" color="gray" onClick={handlePrevPage} />
        <ReuseButton title="Next" color="green" onClick={handleNextPage} />
      </div>
    </div>
  );
};
