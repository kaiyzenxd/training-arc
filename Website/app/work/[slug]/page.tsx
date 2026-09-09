import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Board } from "@/components/board";
import { Chevron } from "@/components/icon";
import { workflows, getWorkflow } from "@/lib/workflows";

export function generateStaticParams() {
  return workflows.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkflow(slug);
  if (!w) return {};
  return {
    title: w.title,
    description: w.summary,
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  if (!workflow) notFound();

  const idx = workflows.findIndex((w) => w.slug === slug);
  const prev = workflows[idx - 1];
  const next = workflows[idx + 1];

  return (
    <article className="page case">
      <Link href="/work" className="back-link legend inline-icon-link">
        <Chevron dir="left" />
        All workflows
      </Link>

      <p className="case-summary prose-measure">{workflow.summary}</p>

      <Board workflow={workflow} variant="full" animate />

      <div className="case-body">
        <aside className="case-rail">
          <section className="bom" aria-labelledby="bom-h">
            <h2 id="bom-h" className="section-label legend">
              Bill of materials
            </h2>
            <ul className="bom-list">
              {workflow.nodes.map((n) => (
                <li key={n.id}>
                  <span className="bom-ref">{n.ref}</span>
                  <span className="bom-what">
                    <span>{n.label}</span>
                    <span className="bom-kind">{n.kind}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="case-prose">
          <Section title="The problem" body={workflow.prose.problem} />
          <Section title="How it’s built" body={workflow.prose.design} />

          <section className="prose-block">
            <h2 className="prose-h stamp">Notable decisions</h2>
            <ul className="decisions">
              {workflow.prose.decisions.map((d, i) => (
                <li key={i}>
                  {d.ref && <span className="decision-ref">{d.ref}</span>}
                  <span>{d.note}</span>
                </li>
              ))}
            </ul>
          </section>

          <Section title="The result" body={workflow.prose.result} />
        </div>
      </div>

      <nav className="case-nav legend" aria-label="More workflows">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="inline-icon-link">
            <Chevron dir="left" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="inline-icon-link">
            {next.title}
            <Chevron dir="right" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <section className="contact-strip" aria-labelledby="c-h">
        <h2 id="c-h" className="stamp contact-title">
          Want one of these for your team?
        </h2>
        <a
          href={`mailto:markryanbaricuatro@gmail.com?subject=${encodeURIComponent(
            `Project enquiry — ${workflow.title}`,
          )}`}
          className="pad-button pad-button--dark"
        >
          Start a project
        </a>
      </section>
    </article>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <section className="prose-block">
      <h2 className="prose-h stamp">{title}</h2>
      {body.map((p, i) => (
        <p key={i} className="prose-measure">
          {p}
        </p>
      ))}
    </section>
  );
}
