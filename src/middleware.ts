import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Créer le client Supabase
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: any) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Liste des routes qui ne nécessitent pas d'authentification
    const publicRoutes = [
        '/login',
        '/register',
        '/auth/confirm',
        '/error'
    ];

    const isPublicRoute = publicRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Liste des ressources statiques à ne pas rediriger
    const isStaticResource = request.nextUrl.pathname.match(
        /\.(.*)$|_next\/static|_next\/image|favicon\.ico/
    );

    // Si l'utilisateur n'est pas connecté et que la route nécessite une authentification, rediriger vers la page de connexion
    if (!user && !isPublicRoute && !isStaticResource) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Si l'utilisateur est connecté et qu'il essaie d'accéder à la page de connexion, rediriger vers la page d'accueil
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
