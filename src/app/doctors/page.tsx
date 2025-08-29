import { Suspense } from "react";
import Loading from "../../app/components/loading";
import DoctorsPage from "./doctors";

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <DoctorsPage />
    </Suspense>
  );
}
