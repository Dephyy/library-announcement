import Link from "next/link";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const errorValue = typeof params.error === "string" ? params.error : "";
  const hasError = errorValue === "invalid";

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-secondary">Staff access</p>
        <h1 className="font-display text-2xl font-semibold text-primary">Admin &amp; librarian login</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Local demo login for the management console. Same layout as the public site.
        </p>
      </header>

      <section
        className="rounded-[0.5rem] bg-surface-low p-6 ring-1 ring-inset ring-outline-variant/50"
        aria-label="Login"
      >
        <div
          className="mb-6 rounded-[0.5rem] bg-surface p-4 ring-1 ring-inset ring-outline-variant/40"
          aria-label="Demo credentials"
        >
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Demo credentials
          </p>
          <p className="font-sans text-sm text-on-surface">
            <strong className="text-primary">Admin:</strong> <code className="rounded bg-surface-low px-1">admin</code> /{" "}
            <code className="rounded bg-surface-low px-1">Admin@123</code>
          </p>
          <p className="mt-2 font-sans text-sm text-on-surface">
            <strong className="text-primary">Librarian:</strong>{" "}
            <code className="rounded bg-surface-low px-1">librarian</code> /{" "}
            <code className="rounded bg-surface-low px-1">Lib@123</code>
          </p>
        </div>

        {hasError ? (
          <p className="mb-4 font-sans text-sm font-medium text-primary" role="alert">
            Invalid username or password. Please try again.
          </p>
        ) : null}

        <form method="POST" action="/api/local-auth/login" className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-sans text-sm font-semibold text-on-surface">
              Username
            </label>
            <input
              id="username"
              name="username"
              required
              autoComplete="username"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-sans text-sm font-semibold text-on-surface">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-[0.5rem] border-0 bg-surface px-3 py-2 font-sans text-sm text-on-surface ring-1 ring-inset ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[0.5rem] bg-primary px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-xs text-on-surface-variant">
          <Link href="/" className="font-semibold text-primary hover:underline">
            Back to public forum
          </Link>
        </p>
      </section>
    </div>
  );
}
