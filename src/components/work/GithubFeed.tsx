"use client";

import { ArrowUpRight, Star } from "@phosphor-icons/react";
import { useGetProjects } from "@/hooks/useGetProjects";
import { siteConfig } from "@/lib/data";

// Live from the GitHub API (cached in Redis by /api/repo): the six most recently updated repos.
export default function GithubFeed() {
  const { data, isPending } = useGetProjects();
  const repos = (data ?? [])
    .filter((r) => r.name && !r.is_template)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);

  if (!isPending && repos.length === 0) return null;

  return (
    <section className="block-pad pt-10">
      <div className="wrap">
        <div className="work-intro">
          <h2 className="display h2">
            Fresh on <span className="hl">GitHub</span>
          </h2>
          <a
            className="btn btn-line"
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener"
          >
            All repositories <ArrowUpRight className="ico" aria-hidden="true" />
          </a>
        </div>
        <div className="idx gh" aria-busy={isPending}>
          {isPending
            ? Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="irow gh-skel" aria-hidden="true" />
              ))
            : repos.map((r) => (
                <a
                  key={r.id}
                  className="irow"
                  href={r.html_url}
                  target="_blank"
                  rel="noopener"
                >
                  <span className="meta">{new Date(r.date).getFullYear()}</span>
                  <strong>{r.name}</strong>
                  <ArrowUpRight className="ico" aria-hidden="true" />
                  <span className="d">
                    {r.description || "No description yet."}
                    <span className="gh-meta">
                      {r.language && <span>{r.language}</span>}
                      <span>
                        <Star className="ico" aria-hidden="true" />{" "}
                        {r.stargazers_count}
                      </span>
                    </span>
                  </span>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
