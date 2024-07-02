import { FC } from "react";
import { IUser } from "@/types/auth";
import UpdatePasswordModalWrapper from "./UpdatePasswordModalWrapper";

interface UpdatePasswordModalProps {
  open: boolean;
  handleClose: () => void;
  user: IUser;
}
const UpdatePasswordModal: FC<UpdatePasswordModalProps> = ({ open, handleClose, user }) =>
  user && <UpdatePasswordModalWrapper open={open} user={user} handleClose={handleClose} />;

export default UpdatePasswordModal;
