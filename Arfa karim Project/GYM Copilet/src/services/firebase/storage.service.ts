import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';
import { AppError } from '@/core/errors/AppError';

export class FirebaseStorageService {
  static async uploadFile(
    path: string,
    file: Blob | Uint8Array | ArrayBuffer,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            reject(new AppError('File upload failed', 'STORAGE_UPLOAD_ERROR', 'error', error));
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (err) {
      throw new AppError('Storage task initialization failed', 'STORAGE_INIT_ERROR', 'error', err);
    }
  }

  static async removeFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      throw new AppError(`Failed to delete storage asset at ${path}`, 'STORAGE_DELETE_ERROR', 'warning', err);
    }
  }
}
