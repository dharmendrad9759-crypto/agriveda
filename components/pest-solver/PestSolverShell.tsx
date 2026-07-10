"use client";

import AppShell from "@/components/shell/AppShell";
import PestDiseaseSolver from "@/components/pest-solver/PestDiseaseSolver";

export default function PestSolverShell() {
  return (
    <AppShell
      className="!bg-transparent"
      title="Pest & Disease Solver"
      subtitle="Symptom guide — likely causes and treatment plans"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pest Solver" }]}
    >
      <PestDiseaseSolver embedded />
    </AppShell>
  );
}
