import { AppShell } from "@/components/app-shell";
import { getGuest, listFollowedChannels } from "@/db/queries";

/** The public site: header, sidebar and menu around every page. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [followed, guest] = await Promise.all([
    listFollowedChannels(),
    getGuest(),
  ]);
  return (
    <AppShell followed={followed} guest={guest}>
      {children}
    </AppShell>
  );
}
