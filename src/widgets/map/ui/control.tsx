import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { Control } from "leaflet";
import {
  ArrowUpRight,
  Locate,
  Map,
  MapPin,
  Minus,
  Pen,
  Plus,
  Power,
  Trash,
} from "lucide-react";
import { CENTER_MAP } from "@/shared/lib/constants";
import "leaflet/dist/leaflet.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordian";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useLongPress } from "@/shared/hooks/use-long-press";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

const RightBottomControl = () => {
  const map = useMap();

  const rightBottomControl = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom - 1);
  }, [map]);

  useEffect(() => {
    map.zoomControl.remove();

    if (rightBottomControl.current) {
      const customControl = Control.extend({
        options: {
          position: "bottomright",
        },
        onAdd: () => rightBottomControl.current,
        onRemove: () => {},
      });

      const control = new customControl();
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map]);

  return (
    <div
      ref={rightBottomControl}
      className="leaflet-control flex flex-col gap-4 pointer-events-auto">
      <div className="flex flex-col shadow-md rounded-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleZoomIn}
                className="p-1.5 cursor-pointer bg-white rounded-t-lg text-zinc-600 bg-opacity-80 backdrop-blur-sm active:bg-opacity-50 pointer-events-auto outline-none">
                <Plus size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-white px-2 py-1">
              Приблизить
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleZoomOut}
                className="p-1.5 cursor-pointer bg-white rounded-b-lg text-zinc-600 bg-opacity-80 backdrop-blur-sm active:bg-opacity-50 pointer-events-auto outline-none">
                <Minus size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-white px-2 py-1">
              Отдалить
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

const LeftTopControl = () => {
  const map = useMap();

  const [isFullMap, setIsFullMap] = useState(false);
  const leftControl = useRef<HTMLDivElement>(null);

  const handleSetCenter = useCallback(() => {
    map.setView(CENTER_MAP, map.getZoom());
    map.setBearing(70.6);
  }, [map]);

  const handleSetFullMap = useCallback(() => {
    setIsFullMap((prev) => !prev);
  }, []);

  useEffect(() => {
    map.zoomControl.remove();

    if (leftControl.current) {
      const customControl = Control.extend({
        options: {
          position: "topleft",
        },
        onAdd: () => leftControl.current,
        onRemove: () => {},
      });

      const control = new customControl();
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map]);

  useEffect(() => {
    if (isFullMap) {
      map.setMaxZoom(24);
      map.setMinZoom(5);
      // @ts-ignore
      map.setMaxBounds(null);
    } else {
      map.setView(CENTER_MAP, 20);
      map.setMaxZoom(24);
      map.setMinZoom(20);

      map.setBearing(70.6);
      map.setMaxBounds([
        [55.70883870523455, 37.44718479653236],
        [55.70783965234657, 37.44555087255109],
      ]);
    }
  }, [map, isFullMap]);

  return (
    <div
      ref={leftControl}
      className="leaflet-control flex flex-col gap-4 pointer-events-auto">
      <div className="flex flex-col gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSetFullMap}
                className="p-1.5 cursor-pointer rounded-lg text-zinc-600 bg-white bg-opacity-80 backdrop-blur-sm shadow-md active:bg-opacity-40 transition-all pointer-events-auto outline-none">
                {isFullMap ? <Map size={24} /> : <MapPin size={24} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white px-2 py-1">
              {isFullMap ? "Карта депо" : "Карта мира"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSetCenter}
                className="p-1.5 cursor-pointer rounded-lg text-zinc-600 bg-white bg-opacity-80 backdrop-blur-sm shadow-md active:bg-opacity-40 transition-all pointer-events-auto outline-none">
                <Locate size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white px-2 py-1">
              Центровать в депо
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

interface CustomControlsProps {
  trackers: {
    id: number;
    name: string;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
    data: {
      id: number;
      deviceId: string;
      commandType: string;
      timestamp: Date;
      status: "A" | "V";
      latitude: number;
      longitude: number;
      speed: number;
      course: number;
      checksum: string;
      additionalData: string;
    }[];
  }[];
  getTrackers: () => Promise<void>;
}

export const CustomControl = ({
  trackers,
  getTrackers,
}: CustomControlsProps) => {
  const map = useMap();

  const { action, elementId, handlers } = useLongPress();

  const [name, setName] = useState<string>();
  const [deviceId, setDeviceId] = useState<string>();

  const rightControl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    map.zoomControl.remove();

    if (rightControl.current) {
      const customControl = Control.extend({
        options: {
          position: "topright",
        },
        onAdd: () => rightControl.current,
        onRemove: () => {},
      });

      const control = new customControl();
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map]);

  return (
    <>
      <LeftTopControl />
      <RightBottomControl />

      <div
        ref={rightControl}
        className="absolute top-0 right-0 z-[9999] flex flex-col gap-4 pointer-events-auto shadow-md rounded-lg mr-2.5 mt-2.5">
        <Accordion type="single" collapsible className="rounded-lg">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="px-3 py-2 bg-white text-zinc-600 font-bold bg-opacity-80 backdrop-blur-sm transition-all ease-out duration-200 rounded-lg flex items-center justify-between w-[200px] data-[state=open]:rounded-t-lg data-[state=open]:rounded-b-none hover:no-underline">
              Список тележек
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 select-none">
              <ScrollArea className="w-full flex flex-col gap-2.5 max-h-[155px] px-2">
                <div className="flex flex-col items-center w-full gap-2.5 my-2">
                  {trackers.map((el, index) => {
                    return (
                      <div
                        id={el.deviceId}
                        key={el.deviceId}
                        {...handlers}
                        className="flex flex-col items-center outline outline-1 max-w-[99%] w-full outline-zinc-400 rounded-lg py-1 select-none">
                        <div className="flex items-center justify-between gap-2 w-full px-1">
                          <div className="flex items-center gap-2">
                            <p>{++index}.</p>
                            <p className="font-light">{el.name}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              className="hover:bg-zinc-300/[0.3] rounded-full p-0.5 transition-all"
                              onClick={() => {
                                map.setView(
                                  [
                                    el.data?.[0].latitude,
                                    el.data?.[0].longitude,
                                  ],
                                  20,
                                );
                              }}>
                              <ArrowUpRight
                                size={16}
                                className="text-zinc-500 cursor-pointer"
                              />
                            </button>

                            <Power
                              size={16}
                              className={cn(
                                el.data?.[0]?.additionalData[5] === "D"
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            />
                          </div>
                        </div>
                        <AnimatePresence>
                          {action === "longpress" &&
                            elementId === el.deviceId && (
                              <>
                                <motion.div
                                  initial={{
                                    width: 0,
                                    height: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                  }}
                                  animate={{
                                    width: "100%",
                                    height: 1,
                                    marginTop: 8,
                                    marginBottom: 4,
                                  }}
                                  exit={{
                                    width: 0,
                                    height: 0,
                                    marginTop: 0,
                                    marginBottom: 0,
                                  }}
                                  className="bg-zinc-400"
                                />

                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="flex flex-col w-full px-1.5 gap-0.5">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <button
                                        className="flex items-center justify-between w-full hover:bg-green-400 hover:text-white group px-1 py-1.5 rounded-md transition-all"
                                        onClick={() => setName(el.name)}>
                                        <p>Редактировать</p>
                                        <Pen
                                          size={16}
                                          className="text-zinc-600/[0.9] group-hover:text-white/[0.6]"
                                        />
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent
                                      className="sm:max-w-[425px] z-[999999] bg-white w-full"
                                      aria-describedby="dsadsa">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Изменить имя тележки
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="flex flex-col gap-3.5">
                                        <div className="flex items-center justify-between">
                                          <label className="font-light">
                                            Имя тележки
                                          </label>
                                          <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => {
                                              setName(e.target.value);
                                            }}
                                            className="outline outline-1 outline-zinc-400 rounded-lg bg-transparent h-7 px-2 text-[14px]"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <button
                                          className="text-white bg-black px-2.5 py-1 rounded-lg hover:bg-zinc-600 transition-all active:scale-95"
                                          onClick={async () => {
                                            await fetch("/api/trackers", {
                                              method: "PATCH",
                                              body: JSON.stringify({
                                                name: name,
                                                deviceId: el.deviceId,
                                              }),
                                            });

                                            setName("");
                                            setDeviceId("");

                                            getTrackers();
                                          }}>
                                          Сохранить
                                        </button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <button
                                    className="flex items-center justify-between w-full hover:bg-red-500 hover:text-white group px-1 py-1.5 rounded-md transition-all"
                                    onClick={async () => {
                                      await fetch(
                                        `/api/trackers/${el.deviceId}`,
                                        {
                                          method: "DELETE",
                                        },
                                      );

                                      getTrackers();
                                    }}>
                                    <p>Удалить</p>
                                    <Trash
                                      size={16}
                                      className="text-zinc-600/[0.9] group-hover:text-white/[0.6]"
                                    />
                                  </button>
                                </motion.div>
                              </>
                            )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="!outline max-w-[92%] outline-1 outline-zinc-400 hover:outline-blue-500 hover:text-blue-500 text-zinc-600 transition-all w-full flex items-center justify-center py-1 rounded-lg">
                    <Plus size={18} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] z-[999999] bg-white w-full">
                  <DialogHeader>
                    <DialogTitle>Добавить тележку</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between">
                      <label className="font-light">Имя тележки</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        className="outline outline-1 outline-zinc-400 rounded-lg bg-transparent h-7 px-2 text-[14px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-light">ID тележки</label>
                      <input
                        type="text"
                        value={deviceId}
                        onChange={(e) => {
                          setDeviceId(e.target.value);
                        }}
                        className="outline outline-1 outline-zinc-400 rounded-lg bg-transparent h-7 px-2 text-[14px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      className="text-white bg-black px-2.5 py-1 rounded-lg hover:bg-zinc-600 transition-all active:scale-95"
                      onClick={() => {
                        fetch("/api/trackers", {
                          method: "POST",
                          body: JSON.stringify({
                            name: name,
                            deviceId: deviceId,
                          }),
                        });

                        setName("");
                        setDeviceId("");

                        setTimeout(() => {
                          getTrackers();
                        }, 500);
                      }}>
                      Добавить
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

{
  /* <div className="flex items-center justify-center flex-col min-w-[180px] w-full px-3 py-2 gap-2.5 cursor-pointer bg-white rounded-lg text-zinc-600 font-bold bg-opacity-80 backdrop-blur-sm pointer-events-auto">
          <div
            className="flex items-center justify-between w-full"
            onClick={handleListOpen}>
            <p>Список тележек</p>
            <ChevronDown size={18} />
          </div>
          <AnimatePresence>
            {isListOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ stiffness: 0, damping: 0 }}
                className="flex flex-col items-center justify-center">
                <div>Hello</div>
                <div>Hello</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */
}
