import { capabilities } from "@/data/site";

export function CapabilityStrip() {
  return (
    <section className="capability-strip" aria-label="Atlas Software capabilities">
      <div className="capability-strip__track">
        {[...capabilities, ...capabilities].map((capability, index) => (
          <span key={`${capability}-${index}`}>
            {capability}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
