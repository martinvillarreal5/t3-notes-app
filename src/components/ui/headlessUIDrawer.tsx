import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X as CloseIcon } from "lucide-react";
type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  initialFocusRef?: React.MutableRefObject<null>;
};

const Drawer = ({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
  initialFocusRef,
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => setIsOpen(false)}
        initialFocus={initialFocusRef}
      >
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

        <div className="fixed inset-x-0 inset-y-0 overflow-hidden">
          <div className="absolute inset-x-0 inset-y-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-full flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-0"
                enterTo="translate-x-full"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-full"
                leaveTo="translate-x-0"
              >
                <Dialog.Panel className="z-100 pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <CloseIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="bg-base-100 flex h-full flex-col overflow-y-auto py-6 shadow-xl">
                    {title && (
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-lg font-medium leading-6">
                          {title}
                        </Dialog.Title>
                      </div>
                    )}
                    {description && (
                      <div className="px-4 sm:px-6">
                        <Dialog.Description>{description}</Dialog.Description>
                      </div>
                    )}
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
