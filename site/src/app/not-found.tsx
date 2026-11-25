import Link from "next/link";

export default function NotFound() {
  return (
    <main className="lost">
      <p className="micro">lane not found</p>
      <h1 className="lost__code">404</h1>
      <p className="lost__line">
        This page never made it onto a lane. The day continues without
        it.
      </p>
      <Link className="btn btn--mt" href="/">
        back to the manifest
      </Link>
    </main>
  );
}
