import { factsData } from "@/lib/data";

export default function Facts() {
  return (
    <div className="wrap">
      <div className="facts">
        {factsData.map((fact) => (
          <div key={fact.label} className="fact" data-rise>
            {fact.count === null ? (
              <b>{fact.label}</b>
            ) : (
              <b
                data-count={fact.count}
                data-pre={fact.pre}
                data-suf={fact.suf}
              >
                {fact.label}
              </b>
            )}
            <span>{fact.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
