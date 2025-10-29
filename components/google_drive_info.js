"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function GoogleDriveInfo() {
  const { data: session } = useSession();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getDriveInfo() {
    if (!session?.accessToken) {
      setError("No Google access token found — please sign in first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=user,storageQuota,kind",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", textAlign: "left" }}>
      <button
        onClick={getDriveInfo}
        disabled={loading}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: "#f3f4f6",
        }}
      >
        {loading ? "Loading..." : "Fetch Google Drive Info"}
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {info && (
        <pre
          style={{
            marginTop: 16,
            background: "#f9fafb",
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
{JSON.stringify(info, null, 2)}
        </pre>
      )}
    </div>
  );
}
