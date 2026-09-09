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
          Each workflow below is a real automation pattern drawn as a board you
          could hand to a fab house: the trigger, the model&rsquo;s reasoning
          steps, the tool calls it makes, and the paths it takes when something
          goes wrong.
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
