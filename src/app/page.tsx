import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { HomeNavigation } from "@/components/home/home-navigation";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import { AmbientEffects } from "@/components/home/ambient-effects";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = !!data.user;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/images/home/hero-reference.png"
          alt="Paisaje de acuarela con una casa de madera, un personaje azul y un gato naranja en un bosque tranquilo"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Sutil textura/viñeta para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-transparent to-cream/20" />
      </div>

      {/* Navegación superior */}
      <HomeNavigation isAuthenticated={isAuthenticated} />

      {/* Efectos ambientales */}
      <AmbientEffects />

      {/* Panel central */}
      <div className="relative z-10 flex min-h-screen items-center justify-center pt-28 pb-12">
        <HomeHeroPanel isAuthenticated={isAuthenticated} />
      </div>
    </main>
  );
}
