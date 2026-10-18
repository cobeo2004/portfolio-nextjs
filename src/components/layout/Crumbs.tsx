import { Fragment } from "react";
import TransitionLink from "@/components/navigation/TransitionLink";

export type TCrumb = { label: string; href?: string };

export default function Crumbs({ items }: { items: TCrumb[] }) {
  return (
    <div className="crumbs">
      {items.map((c, i) => (
        <Fragment key={c.label}>
          {i > 0 && <span>/</span>}
          {c.href ? (
            <TransitionLink href={c.href}>{c.label}</TransitionLink>
          ) : (
            <span>{c.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
