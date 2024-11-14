"use client";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

const SignOutBtn = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransition(async ()=>{
          await logOut();

        });
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOutBtn;
