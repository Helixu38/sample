import dynamic from "next/dynamic";
import { useDeleteApplicant } from "@/hooks/use-delete-applicant"; // Import the delete hook
import { useRefreshApplicants } from "@/hooks/use-refresh-applicant";

const CardWithForm = dynamic(
  () => import("./reusecard").then((mod) => mod.CardWithForm),
  { ssr: false }
);


export const ApplicantList = () => {
    const { applicants, loading, error, refetchApplicants } = useRefreshApplicants(); 
    const { deleteApplicant, loading: deleteLoading, error: deleteError, successMessage } = useDeleteApplicant();

  
    const handleDelete = async (id: string) => {
      await deleteApplicant(Number(id));
      refetchApplicants();  // Refresh the list after deletion
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
  
    return (
      <div>
        {successMessage && <div className="text-green-500">{successMessage}</div>}
        <CardWithForm users={formattedUsers} onDelete={handleDelete} />
      </div>
    );
  };