import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <div>
        <ul>
          <h2 className="text-2xl font-bold">Available Forms</h2>
          <li>
            <Link href="/sf-parking-form" className="underline">
              SF Parking Form
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
