"use client"
import { useState } from "react";
import { ApplicantList } from "@/components/reuse/applicantcard";
import ReuseButton from "@/components/reuse/button";
import { ApplicantCard } from "@/components/reuse/newapplicantcard";

export default function Dashboard() {
  const [showApplicantCard, setShowApplicantCard] = useState(false);

  // Toggle the visibility of ApplicantCard
  const toggleApplicantCard = () => {
    setShowApplicantCard((prev) => !prev);
  };

  const closeApplicantCard = () => {
    setShowApplicantCard(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="">
        <h1 className="text-xl font-semibold mb-6 text-center">Community Center</h1>
        <ReuseButton title="Add" color="blue" onClick={toggleApplicantCard} />
        <ApplicantList />
      </div>

      {/* The New Applicant card overlay */}
      {showApplicantCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <ApplicantCard onClose={closeApplicantCard} />
        </div>
      )}
    </div>
  );
}
