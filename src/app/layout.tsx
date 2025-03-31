import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="FR"
      title="We 💘 pepe!"
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}