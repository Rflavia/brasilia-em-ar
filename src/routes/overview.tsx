import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/overview")({
  component: OverviewRedirect,
});

function OverviewRedirect() {
  return <Navigate to="/" replace />;
}
