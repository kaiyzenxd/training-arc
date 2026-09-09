import type { Metadata } from "next";
import { Board } from "@/components/board";
import { workflows } from "@/lib/workflows";

export const metadata: Metadata = {
  title: "Work",
  description:
    "AI-agent automations built on self-hosted n8n, each drawn as a fabricated board.",
};

export default function WorkIndex() {
  return (
    <div className="page">
      <section className="intro">
        <h1 className="intro-title stamp">Work</h1>
        <p className="intro-body prose-measure">
          Each workflow is drawn as a board &mdash; the trigger, the steps, the
          tool calls, and the paths it takes when something fails. The
          knowledge-base pair is real and downloadable; the rest are labelled
          samples.
        </p>
      </section>

      <div className="board-grid board-grid--wide">
        {workflows.map((w) => (
          <Board key={w.slug} workflow={w} variant="compact" />
        ))}
      </div>
    </div>
  );
}
