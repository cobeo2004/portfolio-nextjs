"use client";

import { useSite } from "@/hooks/useSite";

export default function WizardToggle() {
  const { wizard, setWizard } = useSite();
  return (
    <button className="lnk" type="button" onClick={() => setWizard(!wizard)}>
      {wizard ? "Leave wizard mode" : "Wizard mode"}
    </button>
  );
}
