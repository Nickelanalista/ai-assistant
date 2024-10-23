export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function validateImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagen no válido. Por favor, usa JPG, PNG, GIF o WEBP.');
  }

  if (file.size > maxSize) {
    throw new Error('La imagen es demasiado grande. El tamaño máximo es 20MB.');
  }

  return true;
}

export async function processMultipleImages(files: File[]): Promise<string[]> {
  const validFiles = files.filter(file => {
    try {
      return validateImage(file);
    } catch (error) {
      console.error(`Error validating file ${file.name}:`, error);
      return false;
    }
  });

  const base64Images = await Promise.all(
    validFiles.map(file => convertImageToBase64(file))
  );

  return base64Images;
}
