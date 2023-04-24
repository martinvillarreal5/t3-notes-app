import { Dialog, type DialogPanelProps, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "~/utils/cnHelper";

const ModalBackdrop = () => {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-60" />
    </Transition.Child>
  );
};

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  children?: React.ReactNode;
  initialFocusRef?: React.MutableRefObject<null>;
};

const Modal = ({
  isOpen,
  setIsOpen,
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
        <ModalBackdrop />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center sm:p-4">
            {children}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const ModalDescription = Dialog.Description;

const ModalTitle = Dialog.Title;

const ModalPanelTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      {children}
    </Transition.Child>
  );
};

const ModalPanel = ({
  children,
  className,
  ...props
}: DialogPanelProps<"div">) => {
  return (
    <ModalPanelTransition>
      <Dialog.Panel
        as={"div"}
        className={cn(
          `bg-base-100 w-full max-w-md transform overflow-hidden 
          rounded-md p-6 text-left align-middle shadow-xl transition-all`,
          className
        )}
        {...(props as React.ComponentProps<typeof Dialog.Panel>)}
      >
        {children}
      </Dialog.Panel>
    </ModalPanelTransition>
  );
};

export { Modal, ModalPanel, ModalTitle, ModalDescription };
