function loomEmbed(url: string): string | null {
  const m = url.match(/loom\.com\/(?:share|embed)\/([0-9a-f]{32})/i);
  return m ? `https://www.loom.com/embed/${m[1]}?hide_owner=true&hide_share=true` : null;
}

export function DemoVideo({ url }: { url: string }) {
  const embed = loomEmbed(url);
  return (
    <figure className="demo">
      <figcaption className="section-label legend">Demo &mdash; the workflow running</figcaption>
      <div className="demo-frame">
        <a href={url} target="_blank" rel="noreferrer" className="demo-poster">
          <span className="demo-play" />
          Play the demo
        </a>
        {embed ? (
          <iframe
            src={embed}
            title="Workflow demo"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        ) : (
          <a href={url} target="_blank" rel="noreferrer" className="demo-fallback">
            Watch the demo on Loom
          </a>
        )}
      </div>
    </figure>
  );
}
