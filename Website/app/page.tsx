import Link from "next/link";
import { Board } from "@/components/board";
import { workflows, getFeatured } from "@/lib/workflows";

export default function Home() {
  const featured = getFeatured();
  const rest = workflows.filter((w) => w.slug !== featured.slug);

  return (
    <div className="page">
      <h1 className="lede">
        <b>Mark Ryan Baricuatro</b> builds AI-agent automations on self-hosted
        n8n <span>&mdash; and draws each one as a board you can read: trigger to
        outcome, every failure path in plain sight.</span>
      </h1>

      <section className="featured" aria-label="Featured workflow">
        <Board workflow={featured} variant="hero" featured reveal />
      </section>

      <section className="more" aria-label="More workflows">
        <div className="board-grid">
          {rest.map((w) => (
            <Board key={w.slug} workflow={w} variant="compact" />
          ))}
        </div>
        <Link href="/work" className="text-link legend">
          All workflows
        </Link>
      </section>

      <section className="contact-strip" aria-labelledby="contact-h">
        <h2 id="contact-h" className="stamp contact-title">
          Have a process that should run itself?
        </h2>
        <p className="prose-measure">
          Tell me what the manual version looks like today &mdash; who does it,
          how often, where it breaks &mdash; and I&rsquo;ll tell you whether it
          is worth automating and how I&rsquo;d approach it.
        </p>
        <a
          href="mailto:markryanbaricuatro@gmail.com?subject=Start%20a%20project"
          className="pad-button pad-button--dark"
        >
          Start a project
        </a>
      </section>
    </div>
  );
}
