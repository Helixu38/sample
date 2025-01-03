import { ApplicantList } from "@/components/reuse/applicantcard";

  export default function Dashboard() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="">
          <h1 className="text-xl font-semibold mb-6 text-center">Community Center</h1>
          <ApplicantList></ApplicantList>
        </div>
      </div>
    );
  }
  
