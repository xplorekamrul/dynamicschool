"use client"
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useFileManager } from '@/context/file-manager-context';

interface SelectedFile {
  file: File;
  error?: string;
  uploading?: boolean;
  uploaded?: boolean;
  failed?: boolean;
}

interface MultiSelectDropZoneProps {
  acceptedFileTypes?: string;
  maxFileSize?: number;
  folderPath: string | null;
}

export const MultiSelectDropZone: React.FC<MultiSelectDropZoneProps> = ({
  acceptedFileTypes = '*/*',
  maxFileSize = 10,
  folderPath,
}) => {
  const { uploadFile, activeFolderPath, deleteFile } = useFileManager()
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) return `File size exceeds ${maxFileSize}MB`;
    return null;
  };

  const uploadSingleFile = async (fileIndex: number, fileEntry: SelectedFile) => {
    if (!folderPath || fileEntry.error || fileEntry.uploaded) return;

    setSelectedFiles((prev) => {
      const updated = [...prev];
      updated[fileIndex] = { ...updated[fileIndex], uploading: true };
      return updated;
    });

    try {
      await uploadFile({ 
        path: folderPath, 
        name: fileEntry.file.name, 
        file: fileEntry.file
      });

      setSelectedFiles((prev) => {
        const updated = [...prev];
        updated[fileIndex] = {
          ...updated[fileIndex],
          uploaded: true,
          failed: false,
          uploading: false,
        };
        return updated;
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setSelectedFiles((prev) => {
        const updated = [...prev];
        updated[fileIndex] = {
          ...updated[fileIndex],
          failed: true,
          uploading: false,
        };
        return updated;
      });
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray: SelectedFile[] = Array.from(files).map(file => {
      const error = validateFile(file);
      return { file, error: error || undefined };
    });

    const startIndex = selectedFiles.length;
    const updatedList = [...selectedFiles, ...fileArray];
    setSelectedFiles(updatedList);

    for (let i = 0; i < fileArray.length; i++) {
      const index = startIndex + i;
      const entry = fileArray[i];
      if (!entry.error) {
        await uploadSingleFile(index, entry);
      }
    }
  };

  const removeFile = async (index: number) => {
    const file = selectedFiles[index];
    if (file.uploading) return;
    const terget_path = activeFolderPath + '/' + file.file.name
    await Promise.all([
      deleteFile({ path: terget_path }),
      setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    ])
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        className={`
          w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept={acceptedFileTypes}
        />

        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            {isDragOver ? 'Drop files here!' : 'Drag & drop files here'}
          </div>
          <div className="text-sm text-gray-500">
            or click to browse • Max {maxFileSize}MB • Multiple files supported
          </div>
        </div>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Files ({selectedFiles.length})
          </h3>

          <div 
            className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            onWheel={(e) => {
              e.currentTarget.scrollTop += e.deltaY;
            }}
          >
            {selectedFiles.map((fileItem, index) => {
              const isImage = fileItem.file.type.startsWith('image/');
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center flex-1 space-x-3">
                    {isImage && (
                      <Image
                        src={URL.createObjectURL(fileItem.file)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded border"
                        width={400}
                        height={400}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      {fileItem.error && (
                        <div className="text-xs text-red-600 mt-1">{fileItem.error}</div>
                      )}
                      {fileItem.uploading && (
                        <div className="text-xs text-blue-500">Uploading...</div>
                      )}
                      {fileItem.uploaded && (
                        <div className="text-xs text-green-500">Uploaded ✅</div>
                      )}
                      {fileItem.failed && (
                        <div className="text-xs text-red-500">Upload failed ❌</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFile(index)}
                      disabled={fileItem.uploading}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};