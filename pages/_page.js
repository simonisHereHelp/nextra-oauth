"use client";

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Combined session provider + page logic.
 * - Handles login, session, and redirect all in one file.
 * - No _app.js needed.
 * - Suitable for small prototype / hybrid test.
 */

export default function PageWrapper(props) {
  return (
    <SessionProvider>
      <MainPage />
    </SessionProvider>
  );
}

function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [driveInfo, setDriveInfo] = useState(null);
  const [error, setError] = useState("");

  // Redirect if logged in (optional)
  useEffect(() => {
    if (status === "authenticated") {
      console.log("Logged in as:", session.user?.email);
    }
  }, [status, session]);

  // Minimal proof-of-access test: fetch Google Drive "about" info
  async function fetchDriveInfo() {
    if (!session?.accessToken) {
      setError("No Google access token found. Please log in first.");
      return;
    }
    setError("");
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=user,storageQuota,kind",
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDriveInfo(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Loading state (NextAuth session check)
  if (status === "loading") return <p>Checking session...</p>;

  // Not logged in → show login button
  if (!session) {
    return (
      <main style={{ textAlign: "center", marginTop: "25vh" }}>
        <h1>Welcome to DDROP</h1>
        <p>Sign in with Google to continue.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/_page" })}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      </main>
    );
  }

  // Logged in → show Drive info section
  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
      <h1>Welcome, {session.user?.name || "User"}</h1>
      <p>Email: {session.user?.email}</p>

      <button
        onClick={fetchDriveInfo}
        style={{ padding: "6px 12px", marginTop: "1rem" }}
      >
        Fetch Google Drive Info
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {driveInfo && (
        <pre
          style={{
            background: "#f6f6f6",
            padding: 12,
            borderRadius: 8,
            marginTop: "1rem",
            overflowX: "auto",
          }}
        >
{JSON.stringify(driveInfo, null, 2)}
        </pre>
      )}
    </main>
  );
}
