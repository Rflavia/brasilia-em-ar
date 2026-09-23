import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  LogOut,
  ChevronRight,
} from "lucide-react";

export function ProfilePanel() {
  return (
    <div className="w-full">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="mb-10">
        <p
          className="
            mb-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-primary
          "
        >
          Conta
        </p>

        <h1
          className="
            font-display
            text-3xl
            font-semibold
            tracking-tight
            text-foreground
            md:text-4xl
          "
        >
          Meu perfil
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-6
            text-muted-foreground
            md:text-base
          "
        >
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>


      {/* =====================================================
          PERFIL
      ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border/60
          bg-secondary/20
          p-6
          md:p-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
          "
        >

          {/* AVATAR */}

          <div
            className="
              flex
              size-16
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-primary/30
              bg-primary/10
              text-primary
              md:size-20
            "
          >
            <User className="size-7 md:size-8" />
          </div>


          {/* INFORMAÇÕES */}

          <div className="min-w-0 flex-1">
            <h2
              className="
                font-display
                text-xl
                font-semibold
                text-foreground
                md:text-2xl
              "
            >
              Usuário BOOT
            </h2>

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                text-sm
                text-muted-foreground
              "
            >
              <Mail className="size-4" />

              <span>
                usuario@email.com
              </span>
            </div>
          </div>


          {/* STATUS */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-live/20
              bg-live/5
              px-3
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-live
            "
          >
            <span className="size-1.5 rounded-full bg-live" />

            Conta ativa
          </div>
        </div>
      </div>


      {/* =====================================================
          CONFIGURAÇÕES
      ===================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* DADOS DA CONTA */}

        <section
          className="
            rounded-2xl
            border
            border-border/60
            bg-secondary/10
            p-6
          "
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              <User className="size-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Informações da conta
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Seus dados pessoais
              </p>
            </div>
          </div>


          <div className="space-y-5">

            <div>
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-muted-foreground
                "
              >
                Nome
              </p>

              <p className="mt-2 text-sm text-foreground">
                Usuário BOOT
              </p>
            </div>


            <div className="h-px bg-border/50" />


            <div>
              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-muted-foreground
                "
              >
                E-mail
              </p>

              <p className="mt-2 text-sm text-foreground">
                usuario@email.com
              </p>
            </div>
          </div>


          <button
            type="button"
            className="
              mt-7
              rounded-xl
              border
              border-border/70
              px-4
              py-2.5
              text-xs
              font-medium
              text-foreground
              transition-all
              duration-200
              hover:border-primary/40
              hover:bg-primary/10
            "
          >
            Editar perfil
          </button>
        </section>


        {/* SEGURANÇA */}

        <section
          className="
            rounded-2xl
            border
            border-border/60
            bg-secondary/10
            p-6
          "
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              <ShieldCheck className="size-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Segurança
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Proteção e acesso à conta
              </p>
            </div>
          </div>


          <button
            type="button"
            className="
              group
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              border
              border-border/50
              bg-background/20
              p-4
              text-left
              transition-all
              duration-200
              hover:border-primary/30
              hover:bg-primary/5
            "
          >
            <div
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-secondary
                text-muted-foreground
              "
            >
              <KeyRound className="size-4" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Alterar senha
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Atualize sua senha de acesso
              </p>
            </div>

            <ChevronRight
              className="
                size-4
                text-muted-foreground
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </button>
        </section>
      </div>


      {/* =====================================================
          SESSÃO
      ===================================================== */}

      <section
        className="
          mt-6
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-border/60
          bg-secondary/10
          p-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Sessão
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Encerre sua sessão neste dispositivo.
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-destructive/30
            px-4
            py-2.5
            text-xs
            font-medium
            text-destructive
            transition-all
            duration-200
            hover:bg-destructive/10
          "
        >
          <LogOut className="size-4" />

          Sair da conta
        </button>
      </section>
    </div>
  );
}