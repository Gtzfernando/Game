import { createServiceClient } from "@/lib/supabase/service";
import { initializeProgress } from "@/lib/game/progress-service";

async function main() {
  const email = process.env.PLAYER_EMAIL;
  const password = process.env.PLAYER_PASSWORD;

  if (!email || !password) {
    console.error(
      "Debes definir PLAYER_EMAIL y PLAYER_PASSWORD como variables de entorno."
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("La contraseña debe tener al menos 6 caracteres.");
    process.exit(1);
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log(`El usuario ${email} ya existe.`);
      process.exit(0);
    }
    console.error("Error creando usuario:", error);
    process.exit(1);
  }

  if (!data.user) {
    console.error("No se pudo crear el usuario");
    process.exit(1);
  }

  await initializeProgress(data.user.id);

  console.log(`Usuario ${email} creado con ID ${data.user.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
