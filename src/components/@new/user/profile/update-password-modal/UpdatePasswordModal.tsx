import { getUserAction } from "@/server-actions/user-actions";
import UpdatePasswordModalWrapper from "./UpdatePasswordModalWrapper";

const UpdatePasswordModal = async ({ open }: { open: boolean }) => {
  const user = await getUserAction({ hideEmail: true });
  return user && <UpdatePasswordModalWrapper open={open} user={user} />;
};

export default UpdatePasswordModal;
