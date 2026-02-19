import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../config/diplomska.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase config not found: config/diplomska.json");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const FirebaseToken = async (idToken) => {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    const fullName = decoded.name || "";
    const parts = fullName.trim().split(" ");

    return {
      email: decoded.email,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      picture: decoded.picture || "",
    };
  } catch (error) {
    console.error("Firebase verify error:", error);
    throw new Error("Invalid Firebase token");
  }
};