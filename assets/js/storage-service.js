/* ==========================================================================
   WebWorldBD - Storage Service Interface (Provider-Independent)
   ========================================================================== */

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
 * Provider-independent upload function stub
 * @param {File|Blob} fileOrBlob - The file or blob to upload
 * @param {string} filePath - Path in storage
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} { success: boolean, url: string|null, filePath: string, error: Error|null }
 */
export async function uploadImage(fileOrBlob, filePath, options = {}) {
  // Provider-independent stub: returns safe object ready for future backend integration
  return {
    success: true,
    url: null,
    filePath: filePath,
    error: null
  };
}

/**
 * Gets URL of a file in storage
 * @param {string} filePath - Path or URL
 * @returns {string} URL
 */
export function getImageUrl(filePath) {
  if (!filePath) return '';
  return filePath;
}

/**
 * Provider-independent delete function stub
 * @param {string} filePath - Path or URL to delete
 * @returns {Promise<boolean>}
 */
export async function deleteImage(filePath) {
  return true;
}

/**
 * Provider-independent file replacement stub
 * @param {File|Blob} newFile - New file or blob
 * @param {string} newFilePath - Target file path
 * @param {string|null} oldFilePath - Existing file path to delete
 * @param {Object} options - Upload options
 * @returns {Promise<Object>}
 */
export async function replaceFile(newFile, newFilePath, oldFilePath = null, options = {}) {
  const uploadResult = await uploadImage(newFile, newFilePath, options);
  if (uploadResult.success && oldFilePath && oldFilePath !== newFilePath) {
    await deleteImage(oldFilePath);
  }
  return uploadResult;
}

// Global StorageService object
window.StorageService = {
  validateUploadFile,
  optimizeAndConvertImage,
  uploadImage,
  getImageUrl,
  deleteImage,
  replaceFile
};
