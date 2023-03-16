import React from "react";

type modalProps = {
  id: string;
  //modalFunction: modalFunction;
  children: React.ReactNode;
  hasAction?: boolean;
  actionLabelClassName?: string;
  actionLabelText?: string;
  modalBoxClassName?: string;
};

const Modal = ({
  /* modalFunction */
  id,
  children,
  hasAction = true,
  actionLabelClassName = "btn-outline btn",
  actionLabelText = "Close",
  modalBoxClassName = "border",
}: modalProps) => {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className={`${modalBoxClassName} modal-box`}>
          {children}
          {hasAction && (
            <div className="modal-action ">
              <label
                htmlFor={id}
                className={`${actionLabelClassName}`}
                //TODO Reset input state on click
              >
                {actionLabelText}
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
