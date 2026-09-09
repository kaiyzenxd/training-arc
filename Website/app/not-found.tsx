import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page notfound">
      <h1 className="stamp notfound-title">No trace runs to that address.</h1>
      <p className="notfound-body">
        That page isn&rsquo;t on the board &mdash; a 404. The link may be old or
        mistyped.
      </p>
      <Link href="/" className="pad-button pad-button--dark">
        Back to the board
      </Link>
    </div>
  );
}
