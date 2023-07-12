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

export const loadRemoteStudents = async () => {
  let response = await fetch(`https://llacademy.ng/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: "onosbrown.saved@gmail.com",
      password: "#1414bruno#",
    }),
  });

  const { data } = await response.json();
  response = await fetch(`https://llacademy.ng/api/student-list`, {
    headers: {
      Authorization: data.token,
    },
  });
  // console.log(data)
  return await response.json();
};

export const searchRemoteStudents = async (path: string, search: string) => {
  const token = await remoteLogin({
    email: "onosbrown.saved@gmail.com",
    password: "#1414bruno#",
  });

  const response = await fetch(`https://llacademy.ng/api/student-list-search?${search}`, {
    headers: {
      Authorization: token,
    },
  });

  return await response.json();
};

export const remoteLogin = async (credential: { email: string; password: string }) => {
  let response = await fetch(`https://llacademy.ng/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credential),
  });

  const { data } = await response.json();
  return data.token;
};


/**
 * Gets the first name, technically gets all words leading up to the last
 * Example: "Blake Robertson" --> "Blake"
 * Example: "Blake Andrew Robertson" --> "Blake Andrew"
 * Example: "Blake" --> "Blake"
 * @param str
 * @returns {*}
 */
export const getFirstName = (str: string): string => {
  var arr = str.split(" ");
  if (arr.length === 1) {
    return arr[0];
  }
  return arr.slice(0, -1).join(" "); // returns "Paul Steve"
};

/**
 * Gets the last name (e.g. the last word in the supplied string)
 * Example: "Blake Robertson" --> "Robertson"
 * Example: "Blake Andrew Robertson" --> "Robertson"
 * Example: "Blake" --> "<None>"
 * @param str
 * @param {string} [ifNone] optional default value if there is not last name, defaults to "<None>"
 * @returns {string}
 */
export const getLastName = (str: string, ifNone?: string): string => {
  var arr = str.split(" ");
  if (arr.length === 1) {
    return ifNone || "<None>";
  }
  return arr.slice(-1).join(" ");
};
