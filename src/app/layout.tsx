import { Providers } from "./providers";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import LayoutClient from "./layout-client";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Vérifier si l'utilisateur est authentifié
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    return (
        <html lang="FR">
        <body>
        <Providers>
            <LayoutClient user={user}>
                {children}
            </LayoutClient>
        </Providers>
        </body>
        </html>
    );
}
