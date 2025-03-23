import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import SignUpSuccess from "./success";

const SuccessPage = ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { jwt, jwtRefresh, redirectUrl } = searchParams;

  if (!jwt || !jwtRefresh || !redirectUrl) {
    redirect(routes.auth.signIn.fullUrl);
  }

  return <SignUpSuccess jwt={jwt} jwtRefresh={jwtRefresh} redirectUrl={redirectUrl} />;
};

export default SuccessPage;
