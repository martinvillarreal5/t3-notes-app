import CreateFolderIcon from "../Icons/createFolderIcon";
import Modal from "../modal";

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
  const modalId = "create-folder-modal";
  return (
    <>
      {/* The button to open modal */}
      <label
        className={`btn-square btn ${className}`}
        htmlFor={modalId}
        //onClick={() => openModal()}
      >
        <CreateFolderIcon />
      </label>
      <Modal id={modalId}>
        {
          <>
            <p className="text-md pb-1">Add a new Folder: </p>
            <input
              type="text"
              placeholder="Folder title"
              className="input-bordered  input input-md"
              onKeyDown={(e) => createFunction(e)}
              //TODO Close Modal on Success?
            />
          </>
        }
      </Modal>
    </>
  );
};

export default CreateFolderButton;
