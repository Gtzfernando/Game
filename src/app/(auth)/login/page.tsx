import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/game");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
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

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              El Juego de los Fragmentos
            </h1>
            <p className="mt-2 text-foreground-alt">
              Inicia sesión para continuar tu aventura
            </p>
          </div>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
