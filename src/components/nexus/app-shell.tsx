import { Link } from "@tanstack/react-router";
import { Menu, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";


const navItems = [
  { to: "/overview" as const, label: "Início" },
  { to: "/analysis" as const, label: "Análise" },
  { to: "/history" as const, label: "Histórico" },
  { to: "/data" as const, label: "Resultados" },
];


export function AppShell({
  title,
  lastUpdate,
  children,
}: {
  title: string;
  lastUpdate?: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const lastScrollY = useRef(0);


  /* =====================================================
      CONTROLE DA NAVBAR AO ROLAR A PÁGINA
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
        setMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header
        className={`
          sticky
          top-0
          z-50
          h-20
          border-b
          border-border/40
          bg-background/70
          backdrop-blur-2xl
          backdrop-saturate-150
          transition-all
          duration-500
          ease-out
          ${
            headerVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }
        `}
      >
        <div
          className="
            mx-auto
            grid
            h-20
            w-full
            grid-cols-[1fr_auto_1fr]
            items-center
            px-5
            sm:px-6
            md:px-8
            lg:px-10
            xl:px-12
            2xl:px-14
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex justify-start">
            <Link
              to="/overview"
              className="group flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="
                  flex
                  items-center
                  font-display
                  text-[28px]
                  font-black
                  tracking-[0.07em]
                  sm:text-[30px]
                  lg:text-[32px]
                "
              >
                <span className="text-foreground">
                  B
                </span>

                <span className="text-primary">
                  O
                </span>

                <span className="text-foreground">
                  OT
                </span>
              </div>
            </Link>
          </div>


          {/* =================================================
              NAVEGAÇÃO DESKTOP
          ================================================= */}

          <nav
            className="
              hidden
              items-center
              justify-center
              gap-1
              md:flex
              lg:gap-2
            "
            aria-label="Navegação principal"
          >
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="
                  rounded-xl
                  px-3
                  py-2.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.10em]
                  text-muted-foreground
                  transition-all
                  duration-200
                  hover:bg-secondary/70
                  hover:text-foreground
                  lg:px-5
                  lg:py-3
                  lg:text-[11px]
                "
                activeProps={{
                  className:
                    "bg-primary/40 text-white shadow-[0_0_24px_rgba(49,92,255,0.18)]",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>


          {/* =================================================
              USUÁRIO DESKTOP
          ================================================= */}

          <div
            className="
              hidden
              items-center
              justify-end
              md:flex
            "
          >
            <Link
              to="/profile"
              className="
                group
                flex
                size-11
                items-center
                justify-center
                rounded-full
                border
                border-border/60
                bg-secondary/30
                text-muted-foreground
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-primary/10
                hover:text-primary
              "
              aria-label="Abrir perfil"
            >
              <User
                className="
                  size-5
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            </Link>
          </div>


          {/* =================================================
              BOTÃO MOBILE / TABLET
          ================================================= */}

          <div className="flex justify-end md:hidden">
            <button
              type="button"
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                border
                border-border/70
                bg-background/40
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-secondary
                hover:text-foreground
              "
              onClick={() =>
                setMenuOpen((valor) => !valor)
              }
              aria-label={
                menuOpen
                  ? "Fechar menu"
                  : "Abrir menu"
              }
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>

        </div>


        {/* =====================================================
            MENU MOBILE
        ===================================================== */}

        {menuOpen && (
          <div
            className="
              border-t
              border-border/40
              bg-background/90
              backdrop-blur-2xl
              md:hidden
            "
          >
            <nav
              className="
                mx-auto
                flex
                w-full
                flex-col
                gap-2
                px-5
                py-5
                sm:px-6
              "
              aria-label="Navegação mobile"
            >

              {/* LINKS MOBILE */}

              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    rounded-xl
                    px-4
                    py-4
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-secondary
                    hover:text-foreground
                  "
                  activeProps={{
                    className:
                      "bg-primary/40 text-white shadow-[0_0_20px_rgba(49,92,255,0.16)]",
                  }}
                >
                  {label}
                </Link>
              ))}


              {/* =================================================
                  USUÁRIO MOBILE
              ================================================= */}

              <div
                className="
                  mt-3
                  border-t
                  border-border/60
                  pt-5
                "
              >
                <Link
                  to="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-secondary
                    hover:text-foreground
                  "
                  aria-label="Abrir perfil"
                >
                  <div
                    className="
                      flex
                      size-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-border/60
                      bg-secondary/30
                    "
                  >
                    <User className="size-5" />
                  </div>

                  <div className="text-left">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-foreground
                      "
                    >
                      Usuário
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        text-muted-foreground
                      "
                    >
                      Acessar perfil
                    </p>
                  </div>
                </Link>
              </div>

            </nav>
          </div>
        )}

      </header>


      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <main className="w-full overflow-x-hidden">
        <div className="page-enter">
          {children}
        </div>
      </main>


      {/* =====================================================
          ACESSIBILIDADE
      ===================================================== */}

      <span className="sr-only">
        {title}
        {lastUpdate}
      </span>

    </div>
  );
}