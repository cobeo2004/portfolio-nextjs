"use client";

import RenderModel from "@/components/models/RenderModel";
import { WizardModel } from "@/components/models/wizard.model";

// The floating 3D wizard that comes back in wizard mode.
export default function WizardScene() {
  return (
    <div className="wiz-model" aria-hidden="true">
      <RenderModel className="!w-full !h-full">
        <WizardModel />
      </RenderModel>
    </div>
  );
}
