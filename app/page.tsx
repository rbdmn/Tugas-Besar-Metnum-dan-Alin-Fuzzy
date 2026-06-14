import Topbar from "@/components/Topbar";
import Landing from "@/components/Landing";
import RiskAssessment from "@/components/RiskAssessment";

export default function Home() {
  return (
    <>
      <Topbar />
      <main className="flex-1 space-y-10 px-4 py-10 sm:px-6">
        <Landing />
        <RiskAssessment />
      </main>
      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-content px-4 py-6 sm:px-6">
          <p className="font-mono text-[11px] text-text-muted">
            Tugas Besar Metode Numerik dan Aljabar Linear dan Matriks
          </p>
        </div>
      </footer>
    </>
  );
}
