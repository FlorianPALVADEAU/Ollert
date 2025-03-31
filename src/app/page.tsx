"use client";

import { Button } from "@/components/ui/button";
import FormModal from "@/components/formModal";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { CarType } from "./api/cars/service";
import { useGetAllCars, useCreateCar, useUpdateCar, useDeleteCar } from "./api/endpoints";

export default function Home() {
  const { data: cars, isLoading: isLoadingCars, refetch: carsRefetch } = useGetAllCars();

  const createCarMutation = useCreateCar();
  const updateCarMutation = useUpdateCar();
  const deleteCarMutation = useDeleteCar();

  const handleSave = (car: { id?: string; car?: { brand?: string; model?: string; year?: number; }; brand?: string; model?: string; year?: number; }) => {
    if (car.id) {
      if (car.id && car.brand && car.model && car.year) {
        updateCarMutation.mutate({
          id: car.id,
          car: {
            id: car.id,
            brand: car.brand,
            model: car.model,
            year: car.year,
          },
        });
      }
    } else {
      if (car.brand && car.model && car.year) {
        createCarMutation.mutate({
          brand: car.brand,
          model: car.model,
          year: car.year,
        });
      } else {
        console.error("All fields (brand, model, year) are required to create a car.");
      }
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCarMutation.mutate(id);
    }
  };

  // refetch on every create, update or delete
  useEffect(() => {
    if (createCarMutation.isSuccess || updateCarMutation.isSuccess || deleteCarMutation.isSuccess) {
      carsRefetch();
    }
  }, [createCarMutation.isSuccess, updateCarMutation.isSuccess, deleteCarMutation.isSuccess, carsRefetch]);
  
  return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Car Management</h1>

        {/* Form Modal for adding a new car */}
        <FormModal onSave={handleSave} />

        {/* Car List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Car List</h2>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Brand</th>
                <th className="border border-gray-200 px-4 py-2">Model</th>
                <th className="border border-gray-200 px-4 py-2">Year</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCars ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <span className="w-full flex justify-center items-center h-32">
                        <LoaderCircle className="animate-spin text-gray-900 dark:text-gray-50" size={48} />
                      </span>
                    </td>
                  </tr>
                ) : cars?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No cars available.
                    </td>
                  </tr>
                ) : (
                  cars?.map((car: CarType) => (
                    <tr key={car.id}>
                      <td className="border border-gray-200 px-4 py-2">{car.brand}</td>
                      <td className="border border-gray-200 px-4 py-2">{car.model}</td>
                      <td className="border border-gray-200 px-4 py-2">{car.year}</td>
                      <td className="border border-gray-200 px-4 py-2 flex gap-2">
                        <FormModal car={car} onSave={handleSave} />
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(car.id)}
                          disabled={deleteCarMutation.status === "pending"}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}

            </tbody>
          </table>
        </div>

        {/* Show loader for create or update */}
        {(createCarMutation.status === "pending" || updateCarMutation.status === "pending") && (
          <div className="text-center mt-4">Saving changes...</div>
        )}
      </div>
  );
}