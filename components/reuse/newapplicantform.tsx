"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input"; // Import UI components for styling
import ReuseButton from "./button";
import { Checkbox } from "../ui/checkbox"; // You can change this to a headless UI component later
import { usePostApplicant } from "@/hooks/use-post-applicant";
import { useRefreshApplicants } from "@/hooks/use-refresh-applicant";

const items = [
  { id: "Piano", label: "Piano" },
  { id: "Martial Arts", label: "Martial Arts" },
] as const;

const newApplicantFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  age: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number().int().min(1, { message: "Age must be a positive number" })
  ),
  culturalClasses: z.array(z.string()).refine((value) => value.some((item) => item), {
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
    await postApplicant(values).then(() => refetchApplicants());
  };

  return (
    <form onSubmit={newApplicantForm.handleSubmit(onSubmit)} className="space-y-8">
      {/* Render dynamic form inputs */}
      <div>
        <label>Name </label>
        <InputComponent placeholder="Name" {...newApplicantForm.register("name")} />
      </div>
      <div>
        <label>Age </label>
        <InputComponent type="number" placeholder="Age" {...newApplicantForm.register("age")} />
      </div>
      <div>
        <label>Classes</label>
        {items.map((item) => (
          <div key={item.id}>
            <CheckboxComponent
              checked={newApplicantForm.watch("culturalClasses")?.includes(item.id)}
              onChange={(checked) =>
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
      </div>
      {/* Pass loading and error states to the Button */}
      <ButtonComponent
        title={loading ? "Submitting..." : "Submit"}
        color="green"
        onClick={newApplicantForm.handleSubmit(onSubmit)} // Trigger form submission
      />
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>} {/* Display success message */}
    </form>
  );
}
