// ApplicantCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProfileForm } from "./newapplicantform";
import ReuseButton from "./button";

interface ApplicantCardProps {
  onClose: () => void;
}

export function ApplicantCard({ onClose }: ApplicantCardProps) {
  return (
    <Card className="w-[350px] relative">
      {/* Close button */}
      <div className="absolute top-2 right-2">
        <ReuseButton title="X" color="red" onClick={onClose} />{" "}
      </div>

      <CardHeader>
        <CardTitle>Create New Applicant</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm
          InputComponent={({ ...props }) => (
            <input className="p-2 border rounded" {...props} />
          )}
          CheckboxComponent={({ checked, onChange }) => (
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
            />
          )}
          ButtonComponent={ReuseButton}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Footer content if needed */}
      </CardFooter>
    </Card>
  );
}
