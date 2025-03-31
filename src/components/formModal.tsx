import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormModalProps {
  car?: { id?: string; brand: string; model: string; year: number };
  onSave: (car: { id?: string; brand: string; model: string; year: number }) => void;
}

const FormModal: React.FC<FormModalProps> = ({ car, onSave }) => {
  const [formData, setFormData] = useState(
    car || { brand: "", model: "", year: new Date().getFullYear() }
  );
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setOpen(false); // Fermer la modale après sauvegarde
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            variant={car ? "outline" : "default"} 
            style={{
                backgroundColor: car ? "#f8a15a" : "#4CAF50",
                color: "#000",
                cursor: "pointer",
            }}
        >{car ? "Edit Car" : "Add Car"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add Car"}</DialogTitle>
          <DialogDescription>
            {car
              ? "Edit the details of the car and save your changes."
              : "Add a new car to the list."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brand" className="text-right">
              Brand
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year: parseInt(e.target.value) || new Date().getFullYear(),
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;