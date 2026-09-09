import Link from "next/link";
import { Board } from "@/components/board";
import { workflows, getFeatured } from "@/lib/workflows";

export default function Home() {
  const featured = getFeatured();
  const rest = workflows.filter((w) => w.slug !== featured.slug);

  return (
    <div className="page">
      <section className="intro">
        <h1 className="intro-title stamp">
          AI automation, drawn like a circuit board.
        </h1>
        <p className="intro-body prose-measure">
          I&rsquo;m Mark Ryan Baricuatro. I build workflows on self-hosted n8n
          where a model reads messy input, decides what to do, and calls tools to
          do it &mdash; then document each one as a board: trigger to outcome,
          with every failure path in plain sight.
        </p>
      </section>

      <section className="featured" aria-labelledby="featured-h">
        <h2 id="featured-h" className="section-label legend">
          Featured workflow
        </h2>
        <Board workflow={featured} variant="hero" />
      </section>

      <section className="more" aria-labelledby="more-h">
        <h2 id="more-h" className="section-label legend">
          More work
        </h2>
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
