import Navbar from "./Navbar.jsx";

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title={title} subtitle={subtitle} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
