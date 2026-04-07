import { useState } from 'react'
import { apiInstance } from '@shared/api/baseApi'
import styles from './FileUpload.module.scss'

interface FileUploadProps {
  folder: 'products' | 'banners' | 'categories' | 'news' | 'docs' | 'misc'
  onUpload: (urls: string[]) => void
  multiple?: boolean
  accept?: string
}

export const FileUpload = ({ folder, onUpload, multiple = true, accept = 'image/*' }: FileUploadProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)

  const uploadFiles = async (files: File[]) => {
    setError('')
    setLoading(true)

    try {
      const newUrls: string[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiInstance.post<{ data: { url: string } }>(
          `/upload/${folder}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        newUrls.push(response.data.data.url)
      }

      const allUrls = multiple ? [...uploadedUrls, ...newUrls] : newUrls
      setUploadedUrls(allUrls)
      onUpload(allUrls)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Ошибка при загрузке файла'
      setError(Array.isArray(msg) ? msg.join(', ') : msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) uploadFiles(files)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length > 0) uploadFiles(files)
  }

  const removeFile = (url: string) => {
    const newUrls = uploadedUrls.filter((u) => u !== url)
    setUploadedUrls(newUrls)
    onUpload(newUrls)
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${loading ? styles.loading : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={loading}
          className={styles.input}
          id={`file-upload-${folder}`}
        />
        <label htmlFor={`file-upload-${folder}`} className={styles.label}>
          {loading ? (
            <div className={styles.loadingText}>Загрузка...</div>
          ) : (
            <>
              <div className={styles.icon}>📸</div>
              <div className={styles.title}>Перетащите файлы сюда или нажмите для выбора</div>
              <div className={styles.subtitle}>Поддерживаются: JPG, PNG, WebP, GIF</div>
            </>
          )}
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {uploadedUrls.length > 0 && (
        <div className={styles.preview}>
          <h4>Загруженные файлы ({uploadedUrls.length})</h4>
          <div className={styles.grid}>
            {uploadedUrls.map((url) => (
              <div key={url} className={styles.item}>
                <img src={url} alt="Preview" className={styles.image} />
                <button
                  type="button"
                  onClick={() => removeFile(url)}
                  className={styles.remove}
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
