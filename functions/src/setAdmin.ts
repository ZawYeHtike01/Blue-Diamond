
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

const projectId = "bluediamond-f9c8b";

// Force Admin SDK to use the local Authentication Emulator.
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

initializeApp({projectId});

/**
 * Adds the admin custom claim to a user in the local Auth Emulator.
 */
async function main(): Promise<void> {
  const uid = process.argv[2];

  if (!uid) {
    throw new Error(
      "Usage: npx tsx src/setAdmin.ts \"LOCAL_USER_UID\""
    );
  }

  // Verify the user exists in the local Auth Emulator.
  const user = await getAuth().getUser(uid);

  await getAuth().setCustomUserClaims(uid, {
    ...(user.customClaims ?? {}),
    admin: true,
  });

  console.log(`Local admin claim added for UID: ${uid}`);
}

main().catch((error: unknown) => {
  console.error("Failed to set local admin claim:", error);
  process.exitCode = 1;
});
