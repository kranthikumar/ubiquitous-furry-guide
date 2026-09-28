import { PageHeader } from "@/components/admin/ui";
import { categoryOptions, channelOptions } from "@/db/admin-queries";
import { createVideo } from "../actions";
import { VideoForm } from "../video-form";

export const metadata = { title: "New video" };

export default async function NewVideo() {
  const [channels, categories] = await Promise.all([
    channelOptions(),
    categoryOptions(),
  ]);
  return (
    <>
      <PageHeader
        title="New video"
        back={{ href: "/admin/videos", label: "Videos" }}
      />
      <VideoForm
        action={createVideo}
        channels={channels}
        categories={categories}
      />
    </>
  );
}
