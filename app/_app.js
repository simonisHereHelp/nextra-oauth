"use client";

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Minimal, plain-functional version of _app.js
 * - Provides global session context
 * - Redirects authenticated users
 * - Shows a simple Login button when not signed in
 */

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to your desired page after login
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/_page"); // change to "/upload" if needed
    }
  }, [status, router]);

  // Avoid flicker while checking session
  if (status === "loading") return null;

  // Not signed in → show login button
  if (!session) {
    return (
      <main style={{ textAlign: "center", marginTop: "25vh" }}>
        <h1>Welcome to DDROP</h1>
        <p style={{ opacity: 0.7 }}>Sign in with Google to continue</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/_page" })}
          style={{
            padding: "10px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#f9f9f9",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login with Google
        </button>
      </main>
    );
  }

  // Signed in → render the requested page
  return <>{children}</>;
}
