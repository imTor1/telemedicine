import { Suspense } from "react";
import Loading from "../app/components/loading";
import HomePage from "./home";

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}
