import Link from "next/link";
import React from "react";

import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="font-semibold">404 - Not Found</h2>
      <Button variant={"link"}>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
