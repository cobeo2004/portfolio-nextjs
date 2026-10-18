import {
  FileText,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";
import AskInline from "@/components/chatbot/AskInline";
import { siteConfig } from "@/lib/data";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";

// The cobalt colour-block band that closes every page. On /contact it is the page itself.
export default function ContactBand({ page = false }: { page?: boolean }) {
  return (
    <section className="band" id={page ? "contact-band" : "contact"}>
      <div className="bstair bs1" data-rise-band />
      <div className="bstair bs2" data-rise-band />
      <div className="bstair bs3" data-rise-band />
      <div className="wrap">
        <div>
          {page ? (
            <h1 className="display" data-split data-now>
              Let&apos;s ship something real.
            </h1>
          ) : (
            <h2 className="display" data-split>
              Let&apos;s ship something real.
            </h2>
          )}
          <p className="lede">
            Hiring a forward deployed or full-stack engineer, or need an agent
            working inside your operations? I reply within two working days.
          </p>
          <CopyEmail email={siteConfig.email} />
          <div className="socials">
            <a
              className="btn btn-ghost-inv !h-[46px]"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener"
            >
              <GithubLogo className="ico" aria-hidden="true" /> GitHub
            </a>
            <a
              className="btn btn-ghost-inv !h-[46px]"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener"
            >
              <LinkedinLogo className="ico" aria-hidden="true" /> LinkedIn
            </a>
            <a
              className="btn btn-ghost-inv !h-[46px]"
              href={siteConfig.links.cv}
              target="_blank"
              rel="noopener"
            >
              <FileText className="ico" aria-hidden="true" /> CV
            </a>
          </div>
          {page && <AskInline />}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
