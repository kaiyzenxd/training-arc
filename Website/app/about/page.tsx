import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mark Ryan Baricuatro builds AI-agent automations on self-hosted n8n.",
};

const PRINCIPLES: string[] = [
  "A model gets to reason, but not to act unchecked. The high-stakes step is always a draft a human approves, or a tightly scoped action with a narrow blast radius.",
  "Every path is designed, including the ones where an API times out, a model is unsure, or the input is junk. Silent failure is the bug I care about most.",
  "It runs on infrastructure you own. Self-hosted n8n, your keys, your data — no black-box builder between you and the workflow.",
  "The workflow is documented like a board: what each part does and why it’s there. If you can’t hand it to someone else, it isn’t finished.",
];

export default function About() {
  return (
    <div className="page about">
      <section className="intro">
        <h1 className="intro-title stamp">About</h1>
        <p className="intro-body prose-measure">
          I&rsquo;m Mark Ryan Baricuatro. I build automations for small teams
          that are drowning in a repetitive process &mdash; inbox triage,
          reconciliation, first-line support &mdash; using AI agents on
          self-hosted n8n. The work is equal parts prompt design, systems
          plumbing, and knowing which step a machine should not be trusted with.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="prose-h stamp">How I work</h2>
        <ul className="principles">
          {PRINCIPLES.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="contact-strip" aria-labelledby="c-h">
        <h2 id="c-h" className="stamp contact-title">
          Start a conversation
        </h2>
        <p className="prose-measure">
          The fastest way in is an email describing the manual process as it runs
          today. I&rsquo;ll reply with whether it&rsquo;s a good fit and a rough
          shape for how I&rsquo;d build it.
        </p>
        <a
          href="mailto:markryanbaricuatro@gmail.com?subject=Project%20enquiry"
          className="pad-button pad-button--dark"
        >
          markryanbaricuatro@gmail.com
        </a>
      </section>
    </div>
  );
}
