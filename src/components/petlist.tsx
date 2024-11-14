"use client";
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PetList = () => {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  const {searchText} = useSearchContext();

  const filteredPets = pets.filter((pet) => pet.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => {
              handleChangeSelectedPetId(pet.id);
            }}
            className={cn(
              "flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-x-2 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition",
              { "bg-[#eff1f2]": selectedPetId === pet.id }
            )}
          >
            <Image
              src={
                pet.imageUrl ||
                "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
              }
              alt="Pet image"
              width={45}
              height={45}
              className="rounded-full object-cover w-[45px] h-[45px]"
            />
            <p>{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PetList;
