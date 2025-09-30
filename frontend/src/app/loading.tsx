import { Spinner } from "@/components/ui/shadcn-io/spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner className="text-gray-500" variant={"infinite"} size={64} />
    </div>
  );
};

export default Loading;
