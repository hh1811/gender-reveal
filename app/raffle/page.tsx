import { RaffleView } from "@/components/raffle/RaffleView";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RafflePage() {
  const initial = await getVotesPayload();
  return <RaffleView initial={initial} />;
}
