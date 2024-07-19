import dynamic from "next/dynamic";

const Map = dynamic(() => import("./ui/map"), { ssr: false });

export { Map };
