"use client";

import Link from "next/link";
import { api } from "@/trpc/react";
import { Suspense } from "react";

const Forms = () => {
  const [forms] = api.form.getForms.useSuspenseQuery();

  return (
    <>
      {forms.map((form) => (
        <Link href={`/forms/${form.name}`} key={form.id} className="underline">
          {form.name}
        </Link>
      ))}
    </>
  );
};

export default function Home() {
  return (
    <main>
      <div>
        <ul>
          <h2 className="text-2xl font-bold">Available Forms</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <Forms />
          </Suspense>
        </ul>
      </div>
    </main>
  );
}
