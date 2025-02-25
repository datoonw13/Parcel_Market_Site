import SignInForm from "./sign-in";

const SignInPage = ({ searchParams }: { searchParams: { [key: string]: string } }) => <SignInForm searchParams={searchParams} />;

export default SignInPage;
