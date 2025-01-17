"use client";

import { useState } from "react";
import type { FormConfig, FormData, FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { KEYS } from "@/lib/constants/local-storage";

interface DynamicFormProps {
  config: FormConfig;
}

export function DynamicFormFallback() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <Card className="h-full min-h-[500px] w-[600px]">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export function DynamicForm({ config }: DynamicFormProps) {
  const [persistedData, setPersistedData] = useLocalStorage<FormData>(
    KEYS.USER_DATA,
    {},
  );
  const [formData, setFormData] = useState<FormData>(persistedData);
  const { toast } = useToast();

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    const isValid = config.fields.every((field) => {
      if (field.required && !formData[field.name]) {
        toast({
          title: "Validation Error",
          description: `${field.label} is required.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (!isValid) return;

    setPersistedData({
      ...persistedData,
      ...formData,
    });

    // Reset form and show success message
    toast({
      title: "Form Submitted",
      description: "Your data has been saved to your browser",
    });
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] ?? "",
      required: field.required,
    };

    const inputProps = {
      ...commonProps,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => handleInputChange(field.name, e.target.value),
      className: "w-full",
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...inputProps} />;
      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            onCheckedChange={(checked) =>
              handleInputChange(field.name, Boolean(checked).toString())
            }
            className="ml-1 mt-5"
          />
        );
      default:
        return <Input type={field.type} {...inputProps} />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.fields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
