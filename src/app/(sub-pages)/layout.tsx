import Link from "next/link";
import HomeButton from "../../components/buttons/home.button";

export default function SubPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 xs:px-16 lg:px-32 py-20 relative">
      <div className="z-20">
        <HomeButton />
      </div>
      {children}
    </main>
  );
}
