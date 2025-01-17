import { api } from "@/trpc/server";
import { DynamicForm } from "@/components/common/dynamic-form";

export async function FormPageLoader({
  params,
}: {
  params: Promise<{ formName: string }>;
}) {
  const searchParams = await params;
  console.log({ searchParams });
  const { formName } = searchParams;

  const form = await api.form.getForm({
    name: decodeURIComponent(formName),
  });

  return (
    <main className="py-8">
      <DynamicForm
        config={{ title: form.title, fields: form.fields, id: form.id }}
      />
    </main>
  );
}
