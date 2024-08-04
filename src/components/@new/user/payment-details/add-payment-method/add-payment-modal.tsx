import { FC } from "react";
import { RemoveIcon2 } from "../../../icons/RemoveIcons";
import Button from "../../../shared/forms/Button";
import ResponsiveModal from "../../../shared/modals/ResponsiveModal";
import DialogActions from "../../../shared/modals/dialog/dialog-actions";

interface AddPaymentModalProps {
  open: boolean;
  closeModal: () => void;
}

const Content: FC<AddPaymentModalProps> = ({ closeModal, open }) => (
  <div className="w-full md:bg-white md:shadow-4 rounded-2xl flex flex-col">
    <div className="flex items-center justify-between gap-2 px-5 py-4 md:px-8 md:py-6 md:border-b md:border-b-grey-100">
      <h1 className="text-lg font-semibold">Add Payment Method</h1>
      <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6 hidden md:block" onClick={closeModal}>
        <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
      </Button>
    </div>
    <div className="px-5 md:px-8 md:my-6">content</div>
    <div className="md:hidden mt-7">
      <DialogActions onClose={closeModal} closeLabel="Close" onSubmit={() => {}} submitLabel="Add Card" />
    </div>
  </div>
);

const AddPaymentModal: FC<AddPaymentModalProps> = (props) => {
  const { closeModal, open } = props;
  return (
    <ResponsiveModal
      content={<Content {...props} />}
      responsiveContent={<Content {...props} />}
      open={open}
      handleClose={closeModal}
      desktopModalContentClasses="max-w-lg w-full mx-16"
    />
  );
};

export default AddPaymentModal;
