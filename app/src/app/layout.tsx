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
    <html lang="en" data-testid="html-root">
      <body data-testid="root-layout">
        <div data-testid="header">
          <Header />
        </div>

        <main className="container" role="main" data-testid="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}
