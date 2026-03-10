import "./globals.css";

export const metadata = {
  title: "SmartMoney – AI‑powered finance insights",
  description: "Transform your finances with AI‑powered insights."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
