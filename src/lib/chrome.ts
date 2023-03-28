import { browser } from "$app/environment";

const PrinterExtension = () => {
  const getData = () => {
    if (browser) {
      chrome.storage.local.get("pdfUrl", function (result) {
        console.log("Retrieved data:", result.pdfUrl);
        return result.pdfUrl;
      });
    }
  };
  return {
    getData,
  };
};

export const printer = PrinterExtension();
