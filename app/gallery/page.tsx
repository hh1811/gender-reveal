import { GalleryView } from "@/components/gallery/GalleryView";
import { getVotesPayload } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const initial = await getVotesPayload();
  return <GalleryView initial={initial} />;
}
