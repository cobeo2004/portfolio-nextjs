import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { moreProjectsData, siteConfig } from "@/lib/data";

export default function MoreProjects() {
  return (
    <section className="block-pad pt-10">
      <div className="wrap">
        <h2 className="display h2" data-split>
          More <span className="hl">projects</span>
        </h2>
        <div className="idx">
          {moreProjectsData.map((p) => (
            <a
              key={p.name}
              className="irow"
              data-row
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener"
            >
              <span className="meta">{p.year}</span>
              <strong>{p.name}</strong>
              <ArrowUpRight className="ico" aria-hidden="true" />
              <span className="d">{p.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
