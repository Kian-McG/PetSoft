import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/logo.svg";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        src={logo}
        alt="Logo"
      />
    </Link>
  );
};

export default Logo;
