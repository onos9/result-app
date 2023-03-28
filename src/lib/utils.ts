import { error } from "@sveltejs/kit";

export const customResponse = (status: number, success: boolean, message: string, data = {}) => {
  if (success) {
    return {
      success: success,
      message: message,
      info: data,
    };
  }
  return error(status, {
    success: success,
    message: message,
    info: data,
  } as App.Error);
};

function hex(buffer: ArrayBuffer) {
  const hexCodes: string[] = [];
  const view = new DataView(buffer);
  for (let i = 0; i < view.byteLength; i += 4) {
    const value = view.getUint32(i);
    const stringValue = value.toString(16);
    const padding = "00000000";
    const paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }
  return hexCodes.join("");
}

export async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  return hex(await crypto.subtle.digest("SHA-256", encoder.encode(password)));
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  active: boolean;
}

export const compressImg = (file: File) => {
  if (!file.size) return null;
  return new Promise(function (resolve, reject) {
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = (e) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width * 0.15;
      canvas.height = img.height * 0.15;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            file = new File([blob], file.name, { type: "image/jpg" });
            resolve(file);
          }
        },
        "image/jpg",
        0.9
      );
    };
  });
};
