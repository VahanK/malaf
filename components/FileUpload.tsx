'use client'

import React, { useState } from 'react'
import Button from './ui/Button'
export interface UploadedFile {
  id: string
  file_name: string
  file_path: string
  file_size: number | null
  file_type?: string
  uploaded_by: string
  created_at: string
}

interface FileUploadProps {
  projectId: string
  files: UploadedFile[]
  onUpload: (file: File) => Promise<void>
  onDownload: (fileId: string, filePath: string) => Promise<void>
  onDelete?: (fileId: string, filePath: string) => Promise<void>
  currentUserId: string
}

export default function FileUpload({
  projectId,
  files,
  onUpload,
  onDownload,
  onDelete,
  currentUserId
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return '📄'
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦'
    return '📄'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-neutral-300 hover:border-neutral-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {uploading ? (
            <p className="text-neutral-600">Uploading...</p>
          ) : (
            <>
              <p className="text-neutral-700 font-medium">
                Drop your file here, or{' '}
                <label htmlFor="file-upload" className="text-primary-600 cursor-pointer hover:text-primary-700">
                  browse
                </label>
              </p>
              <p className="text-sm text-neutral-500">Maximum file size: 10MB</p>
            </>
          )}
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Project Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:shadow-soft transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl flex-shrink-0">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900 truncate">
                      {file.file_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{formatFileSize(file.file_size || 0)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(file.id, file.file_path)}
                  >
                    Download
                  </Button>
                  {onDelete && file.uploaded_by === currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(file.id, file.file_path)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
