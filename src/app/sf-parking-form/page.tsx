import { DynamicForm } from "@/components/common/dynamic-form";
import type { FormConfig } from "@/types/form";

const formConfig: FormConfig = {
  title: "User Information Form",
  fields: [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "number",
      required: true,
    },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "zip", label: "Zip", type: "text", required: true },
    { name: "make", label: "Make", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "year", label: "Year", type: "text", required: true },
    { name: "color", label: "Color", type: "text", required: true },
    {
      name: "licensePlate",
      label: "License Plate",
      type: "text",
      required: true,
    },
    {
      name: "permanentPlate",
      label: "Permanent Plate",
      type: "checkbox",
      required: false,
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <DynamicForm config={formConfig} />
    </main>
  );
}
