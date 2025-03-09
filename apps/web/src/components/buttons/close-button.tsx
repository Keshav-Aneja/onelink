import { IoMdClose } from "react-icons/io";
interface CloseButtonProps {
  close?: () => void;
}
const CloseButton = ({ close }: CloseButtonProps) => {
  return (
    <button
      className="absolute top-3 right-3 cursor-pointer p-2 rounded-full hover:bg-primary transition-all duration-200 ease-linear --ol-modal-close-btn"
      type="button"
      onClick={() => {
        console.log("EHRE");
        close && close();
      }}
    >
      <IoMdClose />
    </button>
  );
};

export default CloseButton;
