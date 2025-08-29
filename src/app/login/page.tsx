import { Suspense } from "react";
import Loading from "../../app/components/loading";
import LoginPage from "./login";

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  );
}
