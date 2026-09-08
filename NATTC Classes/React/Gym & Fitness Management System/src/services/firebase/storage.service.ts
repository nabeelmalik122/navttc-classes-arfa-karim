import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase.config";

export class StorageService {
  /**
   * Upload binary file/image to Firebase Storage
   */
  static async uploadFile(path: string, file: File | Blob): Promise<string> {
    if (!isFirebaseConfigured || !storage) {
      throw new Error("LIVE_FIREBASE_STORAGE_NOT_CONFIGURED");
    }
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  /**
   * Delete file from Firebase Storage
   */
  static async deleteFile(path: string): Promise<void> {
    if (!isFirebaseConfigured || !storage) {
      return;
    }
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}
