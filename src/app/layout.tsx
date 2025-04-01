import { Providers } from "./providers";
import "./globals.css";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="FR"
      title="We 💘 pepe!"
    >
      <body>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
              </header>
              {children}
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
