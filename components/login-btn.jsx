import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./Button";
export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Button type="outlined" onClick={() => signOut()}>
          Signed in.
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Button type="outlined" onClick={() => signIn()}>
        Not signed in{' '}
        Sign in
      </Button>
    </>
  );
}
