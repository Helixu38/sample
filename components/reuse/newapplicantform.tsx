"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input"; 
import ReuseButton from "./button";
import { Checkbox } from "../ui/checkbox"; 
import { usePostApplicant } from "@/hooks/use-post-applicant";
import { useRefreshApplicants } from "@/hooks/use-refresh-applicant";

const items = [
  { id: "Piano", label: "Piano" },
  { id: "Martial Arts", label: "Martial Arts" },
] as const;

const capitalizeName = (name: string) => {
  const words = name.split(" ");
  if (words.length < 2) return false;
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(" ") === name;
};

const newApplicantFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .refine(capitalizeName, { message: "Full Name must be capitalized and contain at least 2 words." }),
  age: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number().int().min(10, { message: "Age must be between 10 and 120" }).max(120, { message: "Age must be between 10 and 120" })
  ),
  culturalClasses: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
});

export function ProfileForm({
  InputComponent = Input,
  CheckboxComponent = Checkbox,
  ButtonComponent = ReuseButton,
}: {
  InputComponent?: React.ComponentType<any>;
  CheckboxComponent?: React.ComponentType<any>;
  ButtonComponent?: React.ComponentType<any>;
}) {
  const { refetchApplicants } = useRefreshApplicants();
  const { postApplicant, loading, error, successMessage } = usePostApplicant();
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const newApplicantForm = useForm<z.infer<typeof newApplicantFormSchema>>({
    resolver: zodResolver(newApplicantFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      culturalClasses: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof newApplicantFormSchema>) => {
    console.log("Submitting Applicant Data:", values);
    await postApplicant(values);
    setSubmissionSuccess(true); 
  };

  useEffect(() => {
    if (submissionSuccess) {
      refetchApplicants();
      setSubmissionSuccess(false); 
    }
  }, [submissionSuccess, refetchApplicants]);

  return (
    <form onSubmit={newApplicantForm.handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label>Name</label>
        <InputComponent placeholder="Full Name" {...newApplicantForm.register("name")} />
        {newApplicantForm.formState.errors.name && (
          <span className="text-red-500">{newApplicantForm.formState.errors.name.message}</span>
        )}
      </div>

      <div>
        <label>Age</label>
        <InputComponent type="number" placeholder="Age" {...newApplicantForm.register("age")} />
        {newApplicantForm.formState.errors.age && (
          <span className="text-red-500">{newApplicantForm.formState.errors.age.message}</span>
        )}
      </div>

      <div>
        <label>Classes</label>
        {items.map((item) => (
          <div key={item.id}>
            <CheckboxComponent
              checked={newApplicantForm.watch("culturalClasses")?.includes(item.id)}
              onChange={(checked : boolean) =>
                checked
                  ? newApplicantForm.setValue("culturalClasses", [
                      ...newApplicantForm.getValues("culturalClasses"),
                      item.id,
                    ])
                  : newApplicantForm.setValue(
                      "culturalClasses",
                      newApplicantForm.getValues("culturalClasses").filter((id) => id !== item.id)
                    )
              }
            />
            <label>{item.label}</label>
          </div>
        ))}
        {newApplicantForm.formState.errors.culturalClasses && (
          <span className="text-red-500">
            {newApplicantForm.formState.errors.culturalClasses.message}
          </span>
        )}
      </div>

      <ButtonComponent
        title={loading ? "Submitting..." : "Submit"}
        color="green"
        onClick={newApplicantForm.handleSubmit(onSubmit)}
      />
      
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </form>
  );
}
