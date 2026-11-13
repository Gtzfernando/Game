import Image from "next/image";

interface PageBackgroundProps {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export function PageBackground({
  children,
  overlayOpacity = 0.08,
}: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo ilustrado sutil */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/home/hero-reference.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-cream"
          style={{ opacity: 1 - overlayOpacity }}
        />
      </div>

      {children}
    </div>
  );
}
