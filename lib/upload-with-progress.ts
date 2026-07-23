import { compressImage, type CompressOptions } from './compress-image'

// Uploads an image to the portfolio bucket with real progress reporting.
// fetch() has no upload-progress events, so this uses XMLHttpRequest to fire
// onProgress(0–1) as bytes leave the browser. Compresses first (see
// compress-image) so what we upload — and report progress against — is already
// the small WebP, which is what makes the bar feel fast on 3G.
export async function uploadImageWithProgress(
  file: File,
  onProgress?: (fraction: number) => void,
  opts?: CompressOptions,
): Promise<string | null> {
  const compressed = await compressImage(file, opts)

  const fd = new FormData()
  fd.append('file', compressed)

  return new Promise<string | null>(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload/portfolio')

    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total)
    }
    xhr.onload = () => {
      onProgress?.(1)
      try {
        const json = JSON.parse(xhr.responseText)
        resolve(json.path ?? null)
      } catch {
        resolve(null)
      }
    }
    xhr.onerror = () => resolve(null)
    xhr.send(fd)
  })
}
