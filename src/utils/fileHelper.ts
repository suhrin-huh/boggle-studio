export function generateFileName(text: string = '') {
  const date = new Date();
  const yy = date.getFullYear().toString().substring(2, 4);
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `BOGGLE_STUDIO_${text}_${yy}${MM}${dd}${HH}${mm}${ss}_${randomStr}.png`;
}

export function getStoragePaths(
  records: { image_url: string; video_url: string | null }[],
  bucketName: string,
): string[] {
  const paths: string[] = [];

  records.forEach((record) => {
    if (record.image_url) {
      const imgParts = record.image_url.split(`${bucketName}/`);
      if (imgParts.length > 1) paths.push(imgParts[1]);
    }
    if (record.video_url) {
      const vidParts = record.video_url.split(`${bucketName}/`);
      if (vidParts.length > 1) paths.push(vidParts[1]);
    }
  });

  return paths;
}
