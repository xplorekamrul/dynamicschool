"use client"

import FileManager from "@/components/file-manager/file-manager"
import { FileItem } from "@/types/file-manager"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Image } from "lucide-react"
import TextEditor from "@/components/editor/text-editor"

export default function Dashboard() {
  const [fileManagerOpen, setFileManagerOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Array<Pick<FileItem, 'name' | 'path'>>>([])

  const handleFileSelect = () => {
    //console.log("Files selected:", selectedFiles);
    // Process selected files here
    selectedFiles.forEach(file => {
     // console.log(`File: ${file.name}, Path: ${file.path}`);
    });
    setFileManagerOpen(false);
  }

  const clearSelection = () => {
    setSelectedFiles([]);
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
        </div>

        {/* File Manager Test Section */}
        <div className="bg-white border rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">File Manager Test</h2>

          <div className="space-y-4">
            {/* Open File Manager Button */}
            <div>
              <Button
                onClick={() => setFileManagerOpen(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Open File Manager
              </Button>
            </div>

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <Button
                    onClick={clearSelection}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>

                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded border"
                    >
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image className="h-5 w-5 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {file.path}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Selection Message */}
            {selectedFiles.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  No files selected. Click the button above to open the file manager.
                </p>
              </div>
            )}
          </div>
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2.5">
            <h3 className="font-semibold text-blue-900 mb-2">
              How to use:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>{`Click "Open File Manager" to browse FTP files`}</li>
              <li>Navigate folders in the left sidebar</li>
              <li>Select files by clicking them (supports multiple selection)</li>
              <li>{`Click "Select" to confirm your selection`}</li>
              <li>Selected files will appear below with their paths</li>
            </ul>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Text Editor Test</h2>
          <TextEditor />
        </div>
      </div>

      {/* File Manager Modal */}
      <FileManager
        open={fileManagerOpen}
        setOpen={setFileManagerOpen}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        onSelectCallBack={handleFileSelect}
        multiple={false}
      />
    </div>
  )
}