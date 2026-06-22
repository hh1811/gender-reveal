import { GuestFlow } from "@/components/guest/GuestFlow";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialVotes = await getVotesPayload();
  return <GuestFlow initialVotes={initialVotes} />;
}
