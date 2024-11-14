"use client";

import { CreateCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = ({ searchParams }: PageProps) => {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();
  return (
    <main className="flex flex-col items-center gap-y-10">
      <H1>PetSoft access requires payment</H1>

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await CreateCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
      {searchParams.success && (
        <>
          <p className="text-green-600 text-sm">
            Payment successful! You now have lifetime access to PetSoft
          </p>
          <Button
            onClick={async () => {
              await update(true);
              router.push("/app/dashboard");
            }}
            disabled={status === "loading" || session?.user.hasAccess}
          >
            Access PetSoft
          </Button>
        </>
      )}
      {searchParams.cancelled && (
        <p className="text-red-600 text-sm">Payment failed. Please try again</p>
      )}
    </main>
  );
};

export default Page;
