import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/nexus/app-shell";
import { ProfilePanel } from "@/components/nexus/profile-panel";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      {
        title: "Perfil — BOOT",
      },
      {
        name: "description",
        content: "Gerencie sua conta e configurações do BOOT.",
      },
    ],
  }),

  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell title="Perfil">
      <div
        className="
          mx-auto
          w-full
          px-5
          pb-28
          pt-10
          sm:px-6
          md:px-8
          md:pt-12
          lg:px-10
          lg:pt-14
          xl:px-12
          2xl:px-14
        "
      >
        <ProfilePanel />
      </div>
    </AppShell>
  );
}