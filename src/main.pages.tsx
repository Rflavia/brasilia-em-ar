import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
} from "@tanstack/react-router";
import { BrasiliaHomePage, BrasiliaConditionsPage } from "./components/brasilia/home-page";
import "./styles.css";
import "./styles/brasilia.css";

function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title =
      pathname.endsWith("condicoes") || pathname.endsWith("condicoes/")
        ? "Condições — Brasília em Ar"
        : "Brasília em Ar — Clima, ar e cidade";
  }, [pathname]);
  return <Outlet />;
}
const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: () => (
    <main className="bea-container">
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar ao início</Link>
    </main>
  ),
});
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: BrasiliaHomePage,
});
const conditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/condicoes",
  component: BrasiliaConditionsPage,
});
const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, conditionsRoute]),
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: true,
});
const queryClient = new QueryClient();
const container = document.getElementById("root");
if (!container) throw new Error("Application container missing");
createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
