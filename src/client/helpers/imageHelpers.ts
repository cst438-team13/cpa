export const getScaledImageFromFile = (file: File, size: number) => {
  return new Promise<string | null>((resolve) => {
    // Read cropped file and scale
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const elem = document.createElement("canvas");
        elem.width = size;
        elem.height = size;

        const ctx = elem.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);

        const data = ctx.canvas.toDataURL("image/jpeg");
        resolve(data);
      };
    };

    reader.readAsDataURL(file);
  });
};

export const getImageFromFile = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};
