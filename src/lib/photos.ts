const MAX_EDGE = 1280;
const MAX_CHARS = 380_000;

export function readPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.72;
      let data = canvas.toDataURL("image/jpeg", quality);
      while (data.length > MAX_CHARS && quality > 0.42) {
        quality -= 0.08;
        data = canvas.toDataURL("image/jpeg", quality);
      }
      URL.revokeObjectURL(url);
      if (data.length > 450_000) reject(new Error("too-big"));
      else resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad-image"));
    };
    img.src = url;
  });
}

export function isSafePhoto(value: string): boolean {
  return (
    /^https:\/\/[^\s]+$/i.test(value) || /^data:image\/jpeg;base64,[a-z0-9+/=\s]+$/i.test(value)
  );
}
