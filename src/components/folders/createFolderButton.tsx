type createFunction = (e: React.KeyboardEvent<HTMLInputElement>) => void;

type createFolderButtonProps = {
  className?: string;
  createFunction: createFunction;
};

const CreateFolderButton = ({
  createFunction,
  className = "",
}: createFolderButtonProps) => {
  /* 
  Modal input function calls createFucntion here??
  */

  return (
    <>
      {/* The button to open modal */}
      <label
        className={`${className} btn-square btn`}
        htmlFor="my-modal"
        //onClick={() => openModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          strokeWidth="1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>
      </label>

      {/*
      //TODO move the modal to another component
      */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border">
          <p className="text-md pb-1">Add a new Folder: </p>
          <input
            type="text"
            placeholder="New folder"
            className="input-bordered  input input-md"
            onKeyDown={(e) => createFunction(e)}
            //TODO Close Modal on Success?
          />
          <div className="modal-action ">
            <label
              htmlFor="my-modal"
              className="btn-outline btn"
              //TODO Reset input state on click
            >
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFolderButton;
