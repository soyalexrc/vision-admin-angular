import {DOCUMENT_EXTENSIONS, IMAGE_EXTENSIONS, SPREADSHEET_EXTENSIONS} from "../../core/constants/extentions";

export function isSpreadSheet(file: string) {
  const fileExtension = file.split('.').pop();
  return SPREADSHEET_EXTENSIONS.some(extension => extension === fileExtension);
}

export function isDocument(file: string) {
  const fileExtension = file.split('.').pop();
  return DOCUMENT_EXTENSIONS.some(extension => extension === fileExtension);
}

export function isImage(file: string) {
  const fileExtension = file.split('.').pop();
  return IMAGE_EXTENSIONS.some(extension => extension === fileExtension);
}


export function isOtherFileType(file: string) {
  return (!isDocument(file) && !isSpreadSheet(file) && !isImage(file) && !file.includes('pdf'))
}
