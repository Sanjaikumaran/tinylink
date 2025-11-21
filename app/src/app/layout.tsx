import "./globals.css";
import "@/styles/main.css";
import Header from "@/components/Header";

export const metadata = {
  title: "TinyLink",
  description: "URL Shortener",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
