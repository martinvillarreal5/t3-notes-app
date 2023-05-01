import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X as CloseIcon } from "lucide-react";
import { cn } from "~/utils/cnHelper";

const DrawerDescription = Dialog.Description;
const DrawerTitle = Dialog.Title;

const DrawerBlackdrop = () => {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-60" />
    </Transition.Child>
  );
};

const DrawerPanelTransition = ({
  children,
  orientation,
}: {
  children: React.ReactNode;
  orientation: "right" | "left";
}) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="transform transition ease-in-out duration-500 sm:duration-700"
      enterFrom={orientation === "left" ? "translate-x-0" : "translate-x-full"}
      enterTo={orientation === "left" ? "translate-x-full" : "translate-x-0"}
      leave="transform transition ease-in-out duration-500 sm:duration-700"
      leaveFrom={orientation === "left" ? "translate-x-full" : "translate-x-0"}
      leaveTo={orientation === "left" ? "translate-x-0" : "translate-x-full"}
    >
      {children}
    </Transition.Child>
  );
};

const EaseInOutTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition.Child>
  );
};

const DrawerCloseButton = ({
  setIsOpen,
  orientation,
}: {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  orientation: "right" | "left";
}) => {
  return (
    <EaseInOutTransition>
      <div
        className={cn(
          orientation === "left"
            ? "left-full -mr-8 pl-2 sm:-mr-10 sm:pl-4"
            : "left-0 -ml-8 pr-2 sm:-ml-10  sm:pr-4",
          "absolute top-0 flex pt-4   "
        )}
      >
        <button
          type="button"
          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsOpen(false)}
        >
          <span className="sr-only">Close panel</span>
          <CloseIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </EaseInOutTransition>
  );
};

type DrawerProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  children?: React.ReactNode;
  initialFocusRef?: React.MutableRefObject<null>;
  orientation?: "right" | "left";
};

const Drawer = ({
  isOpen,
  setIsOpen,
  children,
  initialFocusRef,
  orientation = "left",
}: DrawerProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => setIsOpen(false)}
        initialFocus={initialFocusRef}
      >
        <DrawerBlackdrop />
        <div className="fixed inset-x-0 inset-y-0 overflow-hidden">
          <div className="absolute inset-x-0 inset-y-0 overflow-hidden">
            <div
              className={cn(
                `pointer-events-none fixed inset-y-0  flex max-w-full`,
                orientation === "left" ? "right-full pl-10" : "right-0 pl-10"
              )}
            >
              <DrawerPanelTransition orientation={orientation}>
                <Dialog.Panel className="z-100 pointer-events-auto relative w-screen max-w-md">
                  <DrawerCloseButton
                    orientation={orientation}
                    setIsOpen={setIsOpen}
                  />
                  <div className="bg-base-100 flex h-full flex-col overflow-y-auto py-6 shadow-xl">
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </DrawerPanelTransition>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { Drawer, DrawerDescription, DrawerTitle };
