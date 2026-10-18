import { Fragment } from "react";
import BrandIcon, { brandTitle } from "@/components/icons/BrandIcon";
import { marqueeIcons } from "@/lib/data";

export default function Marquee() {
  const names = marqueeIcons.map(brandTitle);
  const items = marqueeIcons.map((name, i) => (
    <Fragment key={name}>
      <span className="marquee-item">
        <BrandIcon name={name} />
        {names[i]}
      </span>
      <i className="marquee-sep" aria-hidden="true" />
    </Fragment>
  ));

  return (
    <div
      className="marquee"
      aria-label={`Tools I ship with: ${names.join(", ")}`}
    >
      <div className="marquee-track" aria-hidden="true">
        {items}
        {items}
      </div>
    </div>
  );
}
