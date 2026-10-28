
import {setGlobalOptions} from "firebase-functions";
import {
  onCall,
  HttpsError,
} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {
  randomUUID,
  createHmac,
} from "node:crypto";

initializeApp();

setGlobalOptions({
  maxInstances: 10,
});

const imageKitPrivateKey = defineSecret(
  "IMAGEKIT_PRIVATE_KEY"
);

export const getImageKitAuth = onCall(
  {
    secrets: [imageKitPrivateKey],
    maxInstances: 5,
  },
  async (request) => {
    // 1. Require a signed-in Firebase user
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Please sign in first."
      );
    }

    // 2. Read ImageKit private key
    const privateKey = imageKitPrivateKey.value();

    console.log(
      "ImageKit secret loaded:",
      Boolean(privateKey)
    );

    if (!privateKey || !privateKey.trim()) {
      throw new HttpsError(
        "internal",
        "ImageKit private key is not configured."
      );
    }

    // 3. Generate ImageKit upload authentication
    const token = randomUUID();
    const expire =
      Math.floor(Date.now() / 1000) + 30 * 60;

    const signature = createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    // 4. Return authentication values
    return {
      token,
      expire,
      signature,
    };
  }
);
