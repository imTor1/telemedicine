import { Suspense } from "react";
import Loading from "../../app/components/loading";
import AppointmentsPage from "./appointments";

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <AppointmentsPage />
    </Suspense>
  );
}
