import ContentBlock from "@/components/content-block";
import Logo from "@/components/logo";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-y-5 justify-center items-center min-h-screen bg-[#5dc9a8]">
    <ContentBlock className="-w-full p-20 flex flex-col gap-y-5 justify-center items-center"><Logo />
    {children}</ContentBlock>
    
    </div>
};

export default Layout;
