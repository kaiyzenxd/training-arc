import Link from "next/link";

export function Nav() {
  return (
    <header className="site-nav">
      <Link href="/" className="site-mark" aria-label="Mark Ryan Baricuatro — home">
        <span className="site-mark-mono">MRB</span>
        <span className="site-mark-full">Mark Ryan Baricuatro</span>
      </Link>
      <nav className="site-links legend" aria-label="Primary">
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <a href="mailto:markryanbaricuatro@gmail.com">Email</a>
      </nav>
    </header>
  );
}
