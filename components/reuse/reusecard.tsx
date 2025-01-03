import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserData {
  id: string;
  title: string;
  content: { label: string; value: string | number; id: string }[];
}

interface CardWithFormProps {
  users: UserData[];
}

export function CardWithForm({ users }: CardWithFormProps) {
  console.log(users);

  return (
    <div className="grid gap-6">
      {users.map((user) => (
        <Card key={user.id} className="w-[350px]">
          <CardHeader>
            <CardTitle>{user.title}</CardTitle>
            <CardDescription>Applicant information</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                {user.content.length === 0 ? (
                  <div>No content available</div> // Fallback if content is empty
                ) : (
                  user.content.map((field) => (
                    <div key={field.id} className="flex flex-col space-y-1.5">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input id={field.id} placeholder={field.label} defaultValue={field.value} readOnly/>
                    </div>
                  ))
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
