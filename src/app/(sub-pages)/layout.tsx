import Link from "next/link";
import HomeButton from "../components/buttons/home.button";

export default function SubPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-20 px-16 relative">
      <div className="z-20">
        <HomeButton />
      </div>
      {children}
    </main>
  );
}
