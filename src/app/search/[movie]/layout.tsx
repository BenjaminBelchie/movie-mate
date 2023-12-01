import Nav from "~/app/_components/navbar";

export default function MovieLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen">
      <Nav />

      {children}
    </section>
  );
}
