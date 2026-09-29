/* ==========================================================================
   WebWorldBD - Supabase Storage Configuration & Utility Module
   ========================================================================== */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://ermmocuyhfbjkzkyfjmj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zPIly33-e8x-3IjTMKRODw_fMAwwUmA";
export const BUCKET_NAME = "webworldbd";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation constraints
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateUploadFile(file, options = {}) {
  const maxSizeMB = options.maxSizeMB || 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedImageTypes = options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowDocuments = options.allowDocuments || false;
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip'];

  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds the maximum allowed limit of ${maxSizeMB} MB.` };
  }

  const validTypes = allowDocuments ? [...allowedImageTypes, ...allowedDocTypes] : allowedImageTypes;
  const isTypeValid = validTypes.includes(file.type.toLowerCase()) || validTypes.some(t => file.name.toLowerCase().endsWith(t.replace('image/', '.').replace('application/', '.')));

  if (!isTypeValid) {
    const formats = allowDocuments ? 'JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX, TXT, ZIP' : 'JPG, JPEG, PNG, WEBP';
    return { valid: false, error: `Unsupported file format. Allowed formats: ${formats}.` };
  }

  return { valid: true, error: null };
}

/**
 * Compresses and converts an image file to WEBP format client-side
 * @param {File} file - Image file
 * @param {number} maxWidth - Max width for scaling
 * @param {number} maxHeight - Max height for scaling
 * @param {number} quality - WEBP compression quality (0 to 1)
 * @returns {Promise<Blob|File>} Compressed image blob or original file
 */
export async function optimizeAndConvertImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  if (!file || !file.type.startsWith('image/')) {
    return file; // Return non-image files as-is
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file); // Fallback to original file
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // Fallback to original file on image load error
    };

    img.src = url;
  });
}

/**
 * Uploads a file/blob to Supabase Storage
 * @param {File|Blob} fileOrBlob - The file or blob to upload
 * @param {string} filePath - Path in bucket, e.g. "avatars/uid/avatar.webp"
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} { success: boolean, url: string|null, filePath: string, error: Error|null }
 */
export async function uploadToSupabaseStorage(fileOrBlob, filePath, options = {}) {
  const bucket = options.bucketName || BUCKET_NAME;
  const contentType = options.contentType || fileOrBlob.type || 'image/webp';

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileOrBlob, {
        upsert: true,
        contentType: contentType,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, url: null, filePath, error };
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = urlData ? urlData.publicUrl : null;

    return {
      success: true,
      url: publicUrl,
      filePath: data ? data.path : filePath,
      error: null
    };
  } catch (err) {
    console.error('Unexpected Supabase upload error:', err);
    return { success: false, url: null, filePath, error: err };
  }
}

/**
 * Gets public URL of a file in Supabase Storage
 * @param {string} filePath - Path in bucket
 * @param {string} bucket - Bucket name
 * @returns {string} Public URL
 */
export function getSupabaseFileUrl(filePath, bucket = BUCKET_NAME) {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath; // Already a full URL
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data ? data.publicUrl : '';
}

/**
 * Deletes a file from Supabase Storage
 * @param {string} filePath - Path in bucket
 * @param {string} bucket - Bucket name
 * @returns {Promise<boolean>}
 */
export async function deleteFromSupabaseStorage(filePath, bucket = BUCKET_NAME) {
  if (!filePath) return true;

  let pathToRemove = filePath;
  // If full URL was passed, extract the path after bucket name
  if (filePath.includes(SUPABASE_URL)) {
    const parts = filePath.split(`${bucket}/`);
    if (parts.length > 1) {
      pathToRemove = parts[1];
    }
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([pathToRemove]);
    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected Supabase delete error:', err);
    return false;
  }
}

/**
 * Safely replaces a file in Supabase Storage
 * Uploads new file first, then removes old file after successful upload.
 * @param {File|Blob} newFile - New file or blob
 * @param {string} newFilePath - Target file path
 * @param {string|null} oldFilePath - Existing file path to delete
 * @param {Object} options - Upload options
 * @returns {Promise<Object>}
 */
export async function replaceSupabaseFile(newFile, newFilePath, oldFilePath = null, options = {}) {
  const uploadResult = await uploadToSupabaseStorage(newFile, newFilePath, options);

  if (uploadResult.success && oldFilePath && oldFilePath !== newFilePath) {
    await deleteFromSupabaseStorage(oldFilePath, options.bucketName || BUCKET_NAME);
  }

  return uploadResult;
}

// Expose globally for vanilla scripts
window.SupabaseStorage = {
  supabase,
  BUCKET_NAME,
  validateUploadFile,
  optimizeAndConvertImage,
  uploadToSupabaseStorage,
  getSupabaseFileUrl,
  deleteFromSupabaseStorage,
  replaceSupabaseFile
};
