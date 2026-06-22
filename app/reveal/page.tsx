import { RevealView } from "@/components/reveal/RevealView";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RevealPage() {
  const initial = await getVotesPayload();
  return <RevealView initial={initial} />;
}
