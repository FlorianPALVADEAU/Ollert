/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useDeleteUser,
  useGetLoggedUser,
  useUpdateUser,
  useUpdateUserPassword,
} from "../api/users/users.endpoints";
import { redirect } from "next/navigation";

const Page = () => {
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const { data, isLoading, refetch } = useGetLoggedUser() as any;
  const updateUserMutation = useUpdateUser();
  const updateUserPasswordMutation = useUpdateUserPassword();
  const deleteAccountMutation = useDeleteUser();

  const handleSubmit = async () => {
    if (!data) {
      console.error("Data is undefined");
      return;
    }

    await updateUserMutation.mutateAsync({
      id: data.id, // Use `data.id` directly
      column: { email: newEmail, name: newName },
    });
    await refetch();
  };

  const handleSubmitPassword = async () => {
    if (!data) {
      console.error("Data is undefined");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      console.error("Passwords do not match");
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      console.error("Password must be at least 8 characters long");
      alert("Password must be at least 8 characters long");
      return;
    }
    if (newPassword.length > 50) {
      console.error("Password must be less than 50 characters long");
      alert("Password must be less than 50 characters long");
      return;
    }
    if (newPassword === data.password) {
      console.error("New password must be different from the old password");
      alert("New password must be different from the old password");
      return;
    }
    if (newPassword === "") {
      console.error("Password cannot be empty");
      alert("Password cannot be empty");
      return;
    }
    if (confirmNewPassword === "") {
      console.error("Confirm password cannot be empty");
      alert("Confirm password cannot be empty");
      return;
    }

    await updateUserPasswordMutation.mutateAsync({
      id: data.id,
      password: newPassword,
    });
    await refetch();
  };

  const handleDeleteAccount = async () => {
    if (!data) {
      console.error("Data is undefined");
      return;
    }

    const response = await deleteAccountMutation.mutateAsync(data.id); // Use `data.id` directly
    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Error deleting account:",
        errorData.error || "Unknown error"
      );
    }
    setNewEmail("");
    setNewPassword("");
    redirect("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(data);

      if (data) {
        setNewEmail(data.email || "");
        setNewName(data?.user_metadata?.name || "");
      } else {
        await refetch();
      }
    };
    fetchData();
  }, [data, refetch]);

  return (
    <div className="p-6 space-y-6 flex justify-start items-start flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réglages</h1>
      </div>

      <div className="w-full flex items-start justify-start gap-4">
        <div className="w-1/3 flex flex-col items-start justify-start gap-4">
          {/* email & name */}
          <div className="w-full flex flex-col items-start justify-center gap-y-4 border-black border rounded-md p-4">
            {/* EDIT USER INFOS */}
            <div className="flex flex-col items-start justify-start w-full">
              <h3 className="text-lg font-semibold">
                Informations utilisateur
              </h3>
              <p className="text-sm text-muted-foreground">
                Modifiez vos informations utilisateur
              </p>
            </div>

            {/* name */}
            <div className="flex items-center w-full justify-start gap-x-2">
              <Input
                type="text"
                placeholder="Name"
                className="w-full"
                disabled={isLoading}
                value={newName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewName(event.target.value)
                }
                name="name"
              />
              <Button disabled={isLoading} onClick={handleSubmit}>
                <CheckCircle className="h-4 w-4" />
                Ok
              </Button>
            </div>

            {/* email */}
            <div className="flex items-center w-full justify-start gap-x-2">
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                disabled={isLoading}
                value={newEmail}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewEmail(event.target.value)
                }
              />
              <Button disabled={isLoading} onClick={handleSubmit}>
                <CheckCircle className="h-4 w-4" />
                Ok
              </Button>
            </div>
          </div>

          {/* password */}
          <div className="w-full flex flex-col items-start justify-center gap-y-4 border-black border rounded-md p-4">
            {/* EDIT USER INFOS */}
            <div className="flex flex-col items-start justify-start w-full">
              <h3 className="text-lg font-semibold">Mot de passe</h3>
              <p className="text-sm text-muted-foreground">
                Modifiez votre mot de passe
              </p>
            </div>

            <div className="flex items-start w-full justify-start gap-2">
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full"
                disabled={isLoading}
                value={newPassword}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPassword(event.target.value)
                }
                name="password"
              />
              <Button
                className="cursor-pointer"
                disabled={isLoading}
                onClick={handleSubmitPassword}
              >
                <CheckCircle className="h-4 w-4" />
                Ok
              </Button>
            </div>

            {/* password */}
            <div className="flex items-start w-full justify-start gap-2">
              <Input
                type="password"
                placeholder="Confirmez le mot de passe"
                className="w-full"
                disabled={isLoading}
                value={confirmNewPassword}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmNewPassword(event.target.value)
                }
                name="confirmPassword"
              />
              <Button
                className="cursor-pointer"
                disabled={isLoading}
                onClick={handleSubmitPassword}
              >
                <CheckCircle className="h-4 w-4" />
                Ok
              </Button>
            </div>
          </div>
        </div>

        {/* danger zone */}
        <div className="flex flex-col items-start justify-start w-1/3 border-red-500 border rounded-md p-4 gap-y-2 bg-red-100">
          <h3 className="text-lg font-semibold text-destructive">
            Zone de danger
          </h3>
          <Button
            variant="destructive"
            className="cursor-pointer"
            disabled={isLoading}
            onClick={handleDeleteAccount}
          >
            Supprimer le compte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
