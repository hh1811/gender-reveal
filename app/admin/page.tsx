import { AdminView } from "@/components/admin/AdminView";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const initial = await getVotesPayload();
  return <AdminView initial={initial} />;
}
