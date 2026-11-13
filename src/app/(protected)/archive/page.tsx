import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  initializeProgress,
  getProgressSummary,
} from "@/lib/game/progress-service";
import { FragmentList } from "@/components/archive/fragment-list";
import { QrCodeList } from "@/components/archive/qr-code-list";
import { Card } from "@/components/ui/card";

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  await initializeProgress(data.user.id);
  const summary = await getProgressSummary(data.user.id);

  const fragments = summary.fragments.map((f) => ({
    stage_number: f.stage_number,
    fragment_text: f.fragment_snapshot,
  }));

  const qrCodes = summary.qr_codes.map((q) => ({
    stage_number: q.stage_number,
    qr_payload: q.qr_payload,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-semibold">Archivo</h1>

      <Card>
        <h2 className="font-serif text-xl font-semibold mb-4 text-moss">
          Textos encontrados
        </h2>
        <FragmentList fragments={fragments} />
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold mb-4 text-moss">
          Códigos QR encontrados
        </h2>
        <QrCodeList qrCodes={qrCodes} />
      </Card>
    </div>
  );
}
