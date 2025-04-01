import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {login, signup} from "@/app/login/action";

export default function LoginPage() {
    return (
        <div className="w-full max-w-md px-4">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Bienvenue</CardTitle>
                    <CardDescription>
                        Connectez-vous ou inscrivez-vous pour continuer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                            <Button
                                formAction={login}
                                type="submit"
                                className="w-full"
                            >
                                Connexion
                            </Button>
                            <Button
                                formAction={signup}
                                variant="outline"
                                className="w-full"
                            >
                                Inscription
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    En vous connectant, vous acceptez nos conditions d'utilisation
                </CardFooter>
            </Card>
        </div>
    );
}
