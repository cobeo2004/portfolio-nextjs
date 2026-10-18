import Mark from "@/components/icons/Mark";
import TransitionLink from "@/components/navigation/TransitionLink";
import WizardToggle from "@/components/wizard/WizardToggle";
import { navItems, siteConfig } from "@/lib/data";
import BigName from "./BigName";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <TransitionLink className="brand mb-3.5" href="/">
              <Mark />
              Simon Nguyen
            </TransitionLink>
            <p>
              Forward deployed and full-stack engineer in Melbourne. Agents, RAG
              and voice systems on backends that hold up.
            </p>
          </div>
          <div>
            <h4>Site</h4>
            {navItems.map((item) => (
              <TransitionLink key={item.key} href={item.href}>
                {item.title}
              </TransitionLink>
            ))}
          </div>
          <div>
            <h4>Elsewhere</h4>
            <a
              href={siteConfig.links.collective}
              target="_blank"
              rel="noopener"
            >
              House of Imaginaries
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noopener">
              GitHub
            </a>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
            <a href={siteConfig.links.cv} target="_blank" rel="noopener">
              CV
            </a>
          </div>
          <div>
            <h4>Hidden</h4>
            <WizardToggle />
            <p className="mt-1.5 !text-[13px]">
              Or type <kbd>accio</kbd> anywhere.
            </p>
          </div>
        </div>
        <BigName />
      </div>
    </footer>
  );
}
