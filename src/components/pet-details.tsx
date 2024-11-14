"use client";
import { usePetContext } from "@/lib/hooks";
import { Pet } from "@prisma/client";
import Image from "next/image";
import PetButton from "./pet-button-component";

function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}
type TopBarProps = {
  pet: Pet;
};

const TopBar = ({ pet }: TopBarProps) => {
  const { handleCheckoutPet } = usePetContext();
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]">
      <Image
        src={
          pet?.imageUrl ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
        }
        alt="Pet image"
        width={75}
        height={75}
        className="rounded-full object-cover w-[75px] h-[75px]"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">{pet.name}</h2>
      <div className="ml-auto space-x-3">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          actionType="checkout"
          onClick={async () => {
            await handleCheckoutPet(pet.id);
          }}
        />
      </div>
    </div>
  );
};
const OtherInfo = ({ pet }: TopBarProps) => {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="uppercase font-medium text-[13px] text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.ownerName}</p>
      </div>
      <div>
        <h3 className="uppercase font-medium text-[13px] text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.age}</p>
      </div>
    </div>
  );
};
const Notes = ({ pet }: TopBarProps) => {
  return (
    <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 borber border-light">
      {pet?.notes}
    </section>
  );
};

const EmptyView = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <p className="text-lg text-zinc-800">No pet selected</p>
    </div>
  );
};

export default PetDetails;
