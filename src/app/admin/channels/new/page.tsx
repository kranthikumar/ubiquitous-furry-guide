import { PageHeader } from "@/components/admin/ui";
import { nextFollowedPosition } from "@/db/admin-queries";
import { createChannel } from "../actions";
import { ChannelForm } from "../channel-form";

export const metadata = { title: "New channel" };

export default async function NewChannel() {
  return (
    <>
      <PageHeader
        title="New channel"
        back={{ href: "/admin/channels", label: "Channels" }}
      />
      <ChannelForm
        action={createChannel}
        nextPosition={await nextFollowedPosition()}
      />
    </>
  );
}
