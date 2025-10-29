import dynamic from "next/dynamic";
const GoogleDriveInfo = dynamic(() => import("@/components/google_drive_info"), { ssr: false });

export default function ProtectedDocsHome() {
  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Google Drive Access Test</h1>
      <GoogleDriveInfo />
    </main>
  );
}
