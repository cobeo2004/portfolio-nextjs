import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import TransitionLink from "@/components/navigation/TransitionLink";
import { awardsData } from "@/lib/data";

export default function Awards() {
  return (
    <section className="block-pad pt-0">
      <div className="wrap">
        <h2 className="display h2" data-split>
          Wins and <span className="hl">school</span>
        </h2>
        <div className="awards">
          {awardsData.map((award) => (
            <div key={award.title} className="award" data-row>
              <b>{award.big}</b>
              <div>
                <h3>{award.title}</h3>
                <p>{award.text}</p>
              </div>
              {award.link ? (
                <TransitionLink className="btn btn-line" href={award.link}>
                  Case study <ArrowRight className="ico" aria-hidden="true" />
                </TransitionLink>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
