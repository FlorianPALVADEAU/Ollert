"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { updateUser, useGetLoggedUser } from "../api/users/users.endpoints"


const Page = () => {
    const [newName, setNewName] = useState<string>("")
    const [newEmail, setNewEmail] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const { data, isLoading, refetch } = useGetLoggedUser()
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "email":
                setNewEmail(value);
                break;
            case "password":
                setNewPassword(value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", { newEmail, newPassword });
        if (!data) {
            console.error("Data is undefined");
            return;
        }
        const userData = await data.json();

        await updateUser(userData.id, { email: newEmail, name: newName });

        setNewEmail("");
        setNewPassword("");
        await refetch();

    }

    useEffect(() => {
        if (data) {
            const fetchEmail = async () => {
                const userData = await data.json();
    
                if (userData?.error) {
                    console.error("Error fetching user data:", userData.error);
                    return;
                } else {
                    setNewEmail(userData?.email || "");
                    setNewName(userData?.name || "");
                }
            };
            fetchEmail();
        }
    }, [data]);



    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Réglages</h1>
                <Button className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau tableau
                </Button>
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-y-12 border-black border rounded-md">
                {/* EDIT USER INFOS */}
                <div className="flex flex-col items-start justify-start w-full">
                    <h3 className="text-lg font-semibold">Informations utilisateur</h3>
                    <p className="text-sm text-muted-foreground">Modifiez vos informations utilisateur</p>
                </div>

                {/* name */}
                <div className="flex items-center w-1/4 justify-start gap-x-2">
                    <Input 
                        type="text"
                        placeholder="Name"
                        className="w-full"
                        disabled={isLoading}
                        value={newName}
                        onChange={handleChange}
                    />
                    <Button 
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Ok
                    </Button>
                </div>

                {/* email */}
                <div className="flex items-center w-1/4 justify-start gap-x-2">
                    <Input 
                        type="email"
                        placeholder="Email"
                        className="w-full"
                        disabled={isLoading}
                        value={newEmail}
                        onChange={handleChange}
                    />
                    <Button 
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Ok
                    </Button>
                </div>

                {/* password */}
                <div className="flex items-start w-1/4 justify-start gap-2">
                    <Input 
                        type="password"
                        placeholder="Mot de passe"
                        className="w-[82%]"
                        disabled={isLoading}
                    />
                    <Button 
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Ok
                    </Button>
                </div>
            </div>

            {/* danger zone */}
            <div className="flex flex-col items-start justify-start w-1/4 border-red-500 border rounded-md p-4 gap-y-2 bg-red-100 mt-24">
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <Button 
                    variant="destructive"
                    className="cursor-pointer"
                    disabled={isLoading}
                >
                    Supprimer le compte
                </Button>
            </div>
        </div>
    )
}

export default Page