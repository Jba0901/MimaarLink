export const MAX_FILE_SIZE_MB = 2;
export const MAX_TOTAL_UPLOAD_SIZE_MB = 3;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_SIZE_BYTES = MAX_TOTAL_UPLOAD_SIZE_MB * 1024 * 1024;

export function uploadTotalSize(files = []) {
  return files.reduce((total, file) => total + (Number(file?.size) || 0), 0);
}

export function fileTooLargeMessage(name = 'File') {
  return `${name} is too large. File upload should be max ${MAX_FILE_SIZE_MB}MB per file.`;
}

export function totalUploadTooLargeMessage() {
  return `Total uploaded files should be max ${MAX_TOTAL_UPLOAD_SIZE_MB}MB per submission.`;
}
