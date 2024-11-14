"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";

import React, { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};
type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  numberOfPets: number;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (pet: PetEssentials) => Promise<void>;
  handleEditPet: (id: Pet["id"], pet: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);
const PetContextProvider = ({ children, data }: PetContextProviderProps) => {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      // return [...state, { ...newPet, id: Date.now().toString() }];
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Date.now().toString() }];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.pet } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //handlers
  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
    console.log("selectedPetId", selectedPetId);
  };
  const handleCheckoutPet = async (id: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: id });
    const error = await deletePet(id);
    if (error) {
      toast.warning(error.message);
    }
    setSelectedPetId(null);
  };
  const handleAddPet = async (pet: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: pet });
    const error = await addPet(pet);
    if (error) {
      toast.warning(error.message);
    }
  };
  const handleEditPet = async (id: Pet["id"], pet: PetEssentials) => {
    setOptimisticPets({ action: "edit", payload: { id, pet } });
    const error = await editPet(id, pet);
    if (error) {
      toast.warning(error.message);
    }
  };
  const getPetById = (id: string) => {};

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContextProvider;
