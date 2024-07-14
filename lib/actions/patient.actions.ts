// "use server";

// import { ID,  Query } from "node-appwrite";

// import InputFile from "node-appwrite/file"

// import {
//   BUCKET_ID,
//   DATABASE_ID,
//   ENDPOINT,
//   PATIENT_COLLECTION_ID,
//   PROJECT_ID,
//   databases,
//   storage,
//   users,
// } from "../appwrite.config";
// import { parseStringify } from "../utils";
// import { CreateUserParams, RegisterUserParams } from "@/types";

// // CREATE APPWRITE USER
// export const createUser = async (user: CreateUserParams) => {
//   try {
//     // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
//     const newuser = await users.create(
//       ID.unique(),
//       user.email,
//       user.phone,
//       undefined,
//       user.name
//     );

//     return parseStringify(newuser);
//   } catch (error: any) {
//     // Check existing user
//     if (error && error?.code === 409) {
//       const existingUser = await users.list([
//         Query.equal("email", [user.email]),
//       ]);

//       return existingUser.users[0];
//     }
//     console.error("An error occurred while creating a new user:", error);
//   }
// };

// // GET USER
// export const getUser = async (userId: string) => {
//   try {
//     const user = await users.get(userId);

//     return parseStringify(user);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the user details:",
//       error
//     );
//   }
// };

// // REGISTER PATIENT
// export const registerPatient = async ({
//   identificationDocument,
//   ...patient
// }: RegisterUserParams) => {
//   try {
//     // Upload file
//     let file;
//     if (identificationDocument) {
//       const blobFile = identificationDocument?.get("blobFile") as Blob;
//       const fileName = identificationDocument?.get("fileName") as string;

//       if (blobFile && fileName) {
//         // Create a File object from the Blob
//         const fileObject = new File([blobFile], fileName, { type: blobFile.type });

//         file = await storage.createFile(BUCKET_ID!, ID.unique(), fileObject);
//       }
//     }

//     // Create new patient document
//     const newPatient = await databases.createDocument(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       ID.unique(),
//       {
//         identificationDocumentId: file?.$id ? file.$id : null,
//         identificationDocumentUrl: file?.$id
//           ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
//           : null,
//         ...patient,
//       }
//     );

//     return parseStringify(newPatient);
//   } catch (error) {
//     console.error("An error occurred while creating a new patient:", error);
//     throw error; // Re-throw the error so it can be handled by the caller
//   }
// };

// // GET PATIENT
// export const getPatient = async (userId: string) => {
//   try {
//     const patients = await databases.listDocuments(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       [Query.equal("userId", [userId])]
//     );

//     return parseStringify(patients.documents[0]);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the patient details:",
//       error
//     );
//   }
// };

// export const getPatientDetails = async (userId: string) => {
//   try {
//     console.log(`Attempting to find patient for userId: ${userId}`);
    
//     // First, get the user details
//     const user = await users.get(userId);
    
//     if (!user) {
//       console.log(`No user found with userId: ${userId}`);
//       return null;
//     }
    
//     console.log(`User found:`, user);

//     // Then, use the user's email to find the patient
//     const patients = await databases.listDocuments(
//       DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       [Query.equal("email", user.email)]
//     );

//     console.log(`Found ${patients.documents.length} patient(s) with email: ${user.email}`);

//     if (patients.documents.length === 0) {
//       console.log(`No patient found with email: ${user.email}`);
//       return null;
//     }

//     console.log(`Patient found:`, patients.documents[0]);
//     return parseStringify(patients.documents[0]);
//   } catch (error) {
//     console.error("An error occurred while retrieving the patient details:", error);
//     return null;
//   }
// };

"use server";

import { ID, Query } from "node-appwrite";
import { CreateUserParams, RegisterUserParams } from "@/types";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT


export const registerPatient = async ({
  identificationDocument,
  ...patientData
}: RegisterUserParams) => {
  try {
    console.log(`Registering patient:`, patientData);

    // Handle file upload if present
    let file;
    if (identificationDocument instanceof FormData) {
      const blobFile = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;

      if (blobFile && fileName) {
        const fileObject = new File([blobFile], fileName, { type: blobFile.type });
        file = await storage.createFile(BUCKET_ID!, ID.unique(), fileObject);
      }
    }

    // Prepare patient data for database
    const patientDataForDb = {
      ...patientData,
      identificationDocumentId: file?.$id || null,
      identificationDocumentUrl: file?.$id
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
        : null,
    };

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      patientDataForDb
    );

    console.log(`Patient registered successfully:`, newPatient);
    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error;
  }
};
// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

export const getPatientDetails = async (userId: string) => {
  try {
    console.log(`Attempting to find patient for userId: ${userId}`);
    
    // First, get the user details
    const user = await users.get(userId);
    
    if (!user) {
      console.log(`No user found with userId: ${userId}`);
      return null;
    }
    
    console.log(`User found:`, user);

    // Then, use the user's email to find the patient
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("email", user.email)]
    );

    console.log(`Found ${patients.documents.length} patient(s) with email: ${user.email}`);

    if (patients.documents.length === 0) {
      console.log(`No patient found with email: ${user.email}`);
      return null;
    }

    console.log(`Patient found:`, patients.documents[0]);
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error("An error occurred while retrieving the patient details:", error);
    return null;
  }
};
