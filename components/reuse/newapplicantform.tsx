"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import ReuseButton from "./button";
import { Checkbox } from "../ui/checkbox";

const items = [
  {
    id: "Piano",
    label: "Piano",
  },
  {
    id: "Martial Arts",
    label: "Martial Arts.",
  },
] as const

const newApplicantFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(50, { message: "Name cannot exceeded 50 characters" }),
  age: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number().int().min(1, { message: "Age must be a positive number" })
  ),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function ProfileForm() {
  // 1. Define your form.
  const newApplicantForm = useForm<z.infer<typeof newApplicantFormSchema>>({
    resolver: zodResolver(newApplicantFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      items: []
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof newApplicantFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...newApplicantForm}>
      <form
        onSubmit={newApplicantForm.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={newApplicantForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>This is your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={newApplicantForm.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Age" {...field} />
              </FormControl>
              <FormDescription>This is your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={newApplicantForm.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Classes</FormLabel>
                <FormDescription>
                  Select the classes.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={newApplicantForm.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <ReuseButton title="Add" color="blue" />
      </form>
    </Form>
  );
}
