'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
    const router = useRouter();

    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <AlertCircleIcon className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Une erreur s'est produite</CardTitle>
                    <CardDescription>
                        Désolé, quelque chose n'a pas fonctionné correctement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    <p>L'opération n'a pas pu être complétée. Veuillez réessayer ou contacter le support si le problème persiste.</p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                    >
                        Retour à l'accueil
                    </Button>
                    <Button
                        onClick={() => router.push('/login')}
                    >
                        Connexion
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
