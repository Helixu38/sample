"use client";
import React, { useEffect, useState } from "react";
import { fetchApplicants } from "@/utils/fetchapplicants";
import { CardWithForm } from "./reusecard";

type Applicant = {
    id: number;
    name: string;
    age: number;
    culturalClasses: string[];
  };
  

  export const ApplicantList = () => {
    const [data, setData] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadApplicants = async () => {
        try {
          const applicants = await fetchApplicants();
          setData(applicants);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };
  
      loadApplicants();
    }, []);
  
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
          value: applicant.culturalClasses.join(", ") || "None",
          id: `cultural-classes-${applicant.id}`,
        },
      ],
    }));
  
    return <CardWithForm users={formattedUsers} />;
  };
