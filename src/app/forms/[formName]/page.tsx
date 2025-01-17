import { FormPageBoundary } from "./boundary";
import { FormPageLoader } from "./loader";

export default async function FormPage({
  params,
}: {
  params: Promise<{ formName: string }>;
}) {
  return (
    <FormPageBoundary>
      <FormPageLoader params={params} />
    </FormPageBoundary>
  );
}
