export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "checkbox" | "file";
  required: boolean;
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}

export type FormData = Record<string, string>;
