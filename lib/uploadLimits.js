export const MAX_FILE_SIZE_MB = 2;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function fileSignature(file = {}) {
  return `${file.name || ''}:${file.size || 0}:${file.type || ''}`;
}

export function fileTooLargeMessage(name = 'File') {
  return `${name} is too large. File upload should be max ${MAX_FILE_SIZE_MB}MB per file.`;
}
