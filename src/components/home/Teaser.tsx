import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import TransitionLink from "@/components/navigation/TransitionLink";

export default function Teaser() {
  return (
    <section className="block-pad">
      <div className="wrap">
        <h2 className="display h2 mb-10" data-split>
          How I <span className="hl">work</span>
        </h2>
        <div className="teaser">
          <div className="shot teaser-shot" data-reveal>
            <Image
              src="/img/dailyos.webp"
              alt="DailyOS Today view"
              width={1280}
              height={711}
              sizes="(max-width: 960px) 100vw, 60vw"
            />
          </div>
          <div data-rise>
            <p>
              I like being in the room with the people who will use what I
              build, then owning the backend that keeps it standing.
            </p>
            <div className="links">
              <TransitionLink className="btn btn-primary" href="/about">
                About me <ArrowRight className="ico" aria-hidden="true" />
              </TransitionLink>
              <TransitionLink className="btn btn-line" href="/contact">
                Get in touch
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
