import { DashboardView } from "@/components/dashboard/DashboardView";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const initial = await getVotesPayload();
  return <DashboardView initial={initial} />;
}
