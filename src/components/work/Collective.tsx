import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { collectiveData } from "@/lib/data";

// House of Imaginaries, the collective behind TrustLane, RSDecider and Scope Eattt.
export default function Collective() {
  return (
    <section className="pb-14">
      <div className="wrap">
        <div className="collective" data-rise>
          <div className="shot" data-reveal>
            <Image
              src="/img/hoi.webp"
              alt="House of Imaginaries home page: We build the things we dream about"
              width={1280}
              height={793}
              sizes="(max-width: 960px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="meta">The collective I build with</span>
            <h2 className="display">
              House of <span className="hl">Imaginaries</span>
            </h2>
            <p>{collectiveData.blurb}</p>
            <ul>
              {collectiveData.projects.map((p) => (
                <li key={p.name}>
                  {p.name} <span>{p.stack}</span>
                </li>
              ))}
            </ul>
            <a
              className="btn btn-moon"
              href={collectiveData.url}
              target="_blank"
              rel="noopener"
            >
              Visit the collective{" "}
              <ArrowUpRight className="ico" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
