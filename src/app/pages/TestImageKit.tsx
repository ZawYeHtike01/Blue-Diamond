
import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getIdToken } from "firebase/auth";
import app, { auth } from "../../firebase/firebase";
import { connectFunctionsEmulator } from "firebase/functions";

type ImageKitAuthResponse = {
  token: string;
  expire: number;
  signature: string;
};

export default function TestImageKit() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function testFunction() {
    setLoading(true);
    setResult("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please sign in first.");
      }

      // Refresh the token so the admin claim is current.
      await getIdToken(user, true);

      const functions = getFunctions(app);
      // Connect only once, before calling the function.
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);

      const callable = httpsCallable<void, ImageKitAuthResponse>(
        functions,
        "getImageKitAuth"
      );

      const response = await callable();

      setResult(
        `SUCCESS!\nToken: ${response.data.token}\nExpires: ${
          new Date(response.data.expire * 1000).toLocaleString()
        }\nSignature received: ${Boolean(response.data.signature)}`
      );
    } catch (error) {
      console.error("ImageKit function test failed:", error);
      setResult(
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Test ImageKit Authentication</h2>
      <button style={{color:"white"}} onClick={testFunction} disabled={loading}>
        {loading ? "Testing..." : "Test Cloud Function"}
      </button>
      <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
    </div>
  );
}
