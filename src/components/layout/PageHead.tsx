import Crumbs, { type TCrumb } from "./Crumbs";

type TPageHeadProps = {
  crumbs: TCrumb[];
  title: string;
  hl: string;
  children?: React.ReactNode;
};

// Breadcrumbs plus a huge page title whose last letters carry the accent colour.
export default function PageHead({
  crumbs,
  title,
  hl,
  children,
}: TPageHeadProps) {
  return (
    <section className="page-head">
      <div className="wrap">
        <Crumbs items={crumbs} />
        <h1 className="display" data-split data-now>
          {title}
          <span className="hl">{hl}</span>
        </h1>
        {children}
      </div>
    </section>
  );
}
