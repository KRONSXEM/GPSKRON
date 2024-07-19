import { Time } from "@/entities/time";
import { Map } from "@/widgets/map";
import "leaflet/dist/leaflet.css";

const Page = () => {
  return (
    <main className="h-screen w-full">
      <Time />
      <Map />
    </main>
  );
};

export default Page;
