import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quoted",
  description: "Where Wit Meets Submit!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center py-14 px-8">
          <h1 className="text-6xl font-bold">Quoted</h1>
          <p className="m-2">Where Wit Meets Submit!</p>
          {children}
          <div className="mt-auto" />
          <p className="mt-4">Nathan Huey 2023</p>
        </main>
      </body>
    </html>
  );
}
