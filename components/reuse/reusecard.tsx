import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReuseButton from "./button";

interface UserData {
  id: string;
  title: string;
  content: { label: string; value: string | number; id: string }[];
  culturalClasses: string[]; // Add cultural classes as a separate field
}

interface CardWithFormProps {
  users: UserData[];
  onDelete: (id: string) => void;
}

export function CardWithForm({ users, onDelete }: CardWithFormProps) {
  const [expandedClassId, setExpandedClassId] = React.useState<string | null>(null); // State to track which cultural class is expanded

  const toggleCulturalClasses = (id: string) => {
    setExpandedClassId((prev) => (prev === id ? null : id)); // Toggle the class visibility
  };

  return (
    <div className="grid gap-6">
      {users.map((user) => (
        <Card key={user.id} className="w-[350px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{user.title}</CardTitle>
                <CardDescription>Applicant information</CardDescription>
              </div>
              <ReuseButton
                title="X"
                color="red"
                onClick={() => onDelete(user.id)} // Delete applicant
              />
            </div>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                {user.content.length === 0 ? (
                  <div>No content available</div>
                ) : (
                  user.content.map((field) => (
                    <div key={field.id} className="flex flex-col space-y-1.5">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input id={field.id} placeholder={field.label} defaultValue={field.value} readOnly />
                    </div>
                  ))
                )}
              </div>

              {/* Collapsible Cultural Classes */}
              <div className="mt-4">
                <ReuseButton
                  title={expandedClassId === user.id ? "Hide Cultural Classes" : "Show Cultural Classes"}
                  color="green"
                  onClick={() => toggleCulturalClasses(user.id)} // Toggle collapsibility
                />
                {expandedClassId === user.id && (
                  <div className="mt-2">
                    <ul>
                      {user.culturalClasses && user.culturalClasses.length > 0 ? (
                        user.culturalClasses.map((classItem, index) => (
                          <li key={index}>{classItem}</li>
                        ))
                      ) : (
                        <li>No cultural classes registered.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
      ))}
    </div>
  );
}
