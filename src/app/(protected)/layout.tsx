import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app/app-header";
import { FloatingHelpButton } from "@/components/game/floating-help-button";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo ilustrado sutil */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/home/hero-reference.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-cream/60" />
      </div>

      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <FloatingHelpButton />
    </div>
  );
}
