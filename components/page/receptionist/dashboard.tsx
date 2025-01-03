"use client";

import { useState } from "react";
import { ApplicantList } from "@/components/reuse/applicantcard";
import ReuseButton from "@/components/reuse/button";
import { NewApplicantCard } from "@/components/reuse/newapplicantcard";

export default function Dashboard() {
  const [showApplicantCard, setShowApplicantCard] = useState(false);

  const toggleApplicantCard = () => {
    setShowApplicantCard((prev) => !prev);
  };

  const closeApplicantCard = () => {
    setShowApplicantCard(false);
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-xl font-semibold mb-6 text-center">Community Center</h1>
        <ReuseButton title="Add" color="blue" onClick={toggleApplicantCard} />
        <ApplicantList /> {/* This will render the list of applicants */}
      </div>

      {/* The New Applicant card overlay */}
      {showApplicantCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <NewApplicantCard onClose={closeApplicantCard}/>
        </div>
      )}
    </div>
  );
}
