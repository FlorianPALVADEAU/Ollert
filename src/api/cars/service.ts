import { faker } from '@faker-js/faker';
import { z } from 'zod';

const CarSchema = z.object({
  id: z.string().uuid(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().gte(1900).lte(new Date().getFullYear()),
});

const CarCreateSchema = CarSchema.omit({ id: true });

export interface CarType extends z.infer<typeof CarSchema> {}

export interface ICarService {
  getAllCars(): CarType[];
  getCarById(id: string): CarType | null;
  createCar(car: Omit<CarType, 'id'>): CarType | null;
  updateCar(id: string, car: Partial<Omit<CarType, 'id'>>): CarType | null;
  deleteCar(id: string): boolean;
}

export class CarService implements ICarService {
  private cars: CarType[] = [];

  constructor() {
    this.seedCars();
  }

  private seedCars(): void {
    for (let i = 0; i < 5; i++) {
      this.cars.push({
        id: faker.string.uuid(),
        brand: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past({ years: 20 }).getFullYear(),
      });
    }
  }

  getAllCars(): CarType[] {
    return this.cars;
  }

  getCarById(id: string): CarType | null {
    return this.cars.find((car) => car.id === id) || null;
  }

    createCar(car: Omit<CarType, 'id'>): CarType | null {
        try {
            const parsedCar = CarCreateSchema.parse(car);

            let newId: string;
            do {
            newId = faker.string.uuid();
            } while (this.cars.some((existingCar) => existingCar.id === newId));

            console.log("Generated new car ID:", newId); // Log de l'ID généré
            const newCar: CarType = { id: newId, ...parsedCar };
            this.cars.push(newCar);
            return newCar;
        } catch (error) {
            console.error("Error creating car:", error);
            return null;
        }
    }

    updateCar(id: string, car: Partial<Omit<CarType, 'id'>>): CarType | null {
        try {
            console.log("Updating car with ID:", id, "Data:", car); // Log des données
            const carIndex = this.cars.findIndex((c) => c.id === id);
            if (carIndex === -1) {
            console.error("Car not found with ID:", id); // Log si l'ID est introuvable
            return null;
            }

            const updatedCar = { ...this.cars[carIndex], ...car };
            CarSchema.parse(updatedCar); // Valider l'objet complet après mise à jour

            this.cars[carIndex] = updatedCar;
            return this.cars[carIndex];
        } catch (error) {
            console.error("Error updating car:", error); // Log de l'erreur
            return null;
        }
    }

  deleteCar(id: string): boolean {
    const initialLength = this.cars.length;
    this.cars = this.cars.filter((car) => car.id !== id);
    return this.cars.length < initialLength;
  }
}