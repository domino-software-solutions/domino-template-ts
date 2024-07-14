// import {AppointmentForm} from "@/components/forms/AppointmentForm";
// import PatientForm from "@/components/forms/PatientForm";
// import Image from "next/image";
// import Link from "next/link";
// import { getPatient } from "@/lib/actions/patient.actions";

// export default async function NewAppointment({ params: { userId } }: { params: { userId: string } }) {
//   const patient = await getPatient(userId);
//  if (!patient) {
//     // Handle the case where no patient was found
//     return <div>Patient not found</div>;
//   }

//   return (
//     <div className="flex h-screen max-h-screen">
//       <section className="remove-scrollbar container my-auto">
//         <div className="sub-container max-w-[860px] flex-1 justify-between">
//           <Image
//             src="/assets/icons/logo-full.svg"
//             height={1000}
//             width={1000}
//             alt="logo"
//             className="mb-12 h-10 w-fit"
//           />

//           <AppointmentForm
//             patientId={patient?.$id}
//             userId={userId}
//             type="create"
//           />

//           <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
//         </div>
//       </section>

//       <Image
//         src="/assets/images/appointment-img.png"
//         height={1500}
//         width={1500}
//         alt="appointment"
//         className="side-img max-w-[390px] bg-bottom"
//       />
//     </div>
//   );
// };


import { AppointmentForm } from "@/components/forms/AppointmentForm";
import Image from "next/image";
import Link from "next/link";
import { getPatientDetails } from "@/lib/actions/patient.actions";

export default async function NewAppointment({ params: { userId } }: { params: { userId: string } }) {
  console.log(`Attempting to fetch patient details for userId: ${userId}`);
  const patient = await getPatientDetails(userId);

  if (!patient) {
    console.log(`No patient found for userId: ${userId}`);
    return (
      <div className="flex h-screen max-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Patient not found</h1>
          <p className="mb-4">Please complete your registration before booking an appointment.</p>
          <Link href={`/patients/${userId}/register`} className="text-blue-500 hover:underline">
            Complete Registration
          </Link>
        </div>
      </div>
    );
  }

  console.log(`Patient found:`, patient);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
