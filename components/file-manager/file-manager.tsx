"use client"

import Image from "next/image"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import {
  BoxSelect,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Eye,
  File,
  FileText,
  Grid,
  ImageIcon,
  List,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { useFileManager } from "@/context/file-manager-context"
import { useSearchFiles } from "@/lib/file-manager/queries"
import { getImageUrl } from "@/lib/shared/image-utils"
import type { FileItem } from "@/types/file-manager"
import CreateRootFolder from "./create-root-folder"
import FolderTree from "./folder-tree"
import { MultiSelectDropZone } from "./multi-select-drop-zone"

type FileManagerProps = {
  open: boolean
  setOpen: (value: boolean) => void
  selectedFiles: Array<Pick<FileItem, "name" | "path">>
  setSelectedFiles: React.Dispatch<React.SetStateAction<Pick<FileItem, "name" | "path">[]>>
  onSelectCallBack: () => void
  multiple?: boolean
}

export default function FileManager({
  open,
  setOpen,
  multiple = false,
  selectedFiles,
  setSelectedFiles,
  onSelectCallBack,
}: FileManagerProps) {
  const {
    activeFolderPath,
    files,
    viewMode,
    setViewMode,
    openUploader,
    setOpenUploader,
    deleteFile,
    deletingFilePath,
  } = useFileManager()

  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number>(-1)

  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchResults, setSearchResults] = useState<FileItem[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Search query hook
  const { data: searchData, refetch: performSearch, isLoading: isSearching } = useSearchFiles(searchInput)

  // Update search results when data changes
  useEffect(() => {
    if (searchData?.files) {
      setSearchResults(searchData.files)
    }
  }, [searchData])

  // Displayed files logic
  const displayedFiles = useMemo(() => {
    if (!searchMode) return files
    return searchResults
  }, [files, searchMode, searchResults])

  // Auto-focus search input when search mode is activated
  useEffect(() => {
    if (searchMode && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchMode])

  // Handle search button click
  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      performSearch()
    }
  }

  // Handle search mode toggle
  const toggleSearchMode = () => {
    setSearchMode((prev) => !prev)
    if (searchMode) {
      // Clear search when exiting search mode
      setSearchQuery("")
      setSearchInput("")
      setSearchResults([])
    }
  }

  // Handle ESC key to exit search mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchMode) {
        setSearchMode(false)
        setSearchQuery("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchMode])

  function getFileTypeFromName(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase() || ""
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"]
    const textExts = ["txt", "md", "json", "xml", "csv"]

    if (imageExts.includes(ext)) return "image"
    if (ext === "pdf") return "pdf"
    if (textExts.includes(ext)) return "text"
    return "file"
  }

  function getFileIcon(filename: string) {
    const type = getFileTypeFromName(filename)
    if (type === "image") return <ImageIcon className="h-8 w-8 text-gray-400" />
    if (type === "pdf") return <FileText className="h-8 w-8 text-red-600" />
    if (type === "text") return <FileText className="h-8 w-8 text-gray-600" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
  }

  function toggleFileSelection(file: Pick<FileItem, "name" | "path">) {
    if (multiple) {
      setSelectedFiles((prev) =>
        prev.find((f) => f.path === file.path) ? prev.filter((f) => f.path !== file.path) : [...prev, file]
      )
    } else {
      setSelectedFiles((prev) => (prev.find((f) => f.path === file.path) ? [] : [file]))
    }
  }

  function openPreview(file: FileItem, index: number) {
    setPreviewFile(file)
    setPreviewIndex(index)
  }

  function closePreview() {
    setPreviewFile(null)
    setPreviewIndex(-1)
  }

  function goToPrevious() {
    if (previewIndex > 0) {
      const newIndex = previewIndex - 1
      setPreviewIndex(newIndex)
      setPreviewFile(displayedFiles[newIndex])
    }
  }

  function goToNext() {
    if (previewIndex < displayedFiles.length - 1) {
      const newIndex = previewIndex + 1
      setPreviewIndex(newIndex)
      setPreviewFile(displayedFiles[newIndex])
    }
  }

  const handleDelete = async (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteFile({ path: file.path })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[60]" />

        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="z-[70] !max-w-[95%] h-[98vh]  p-0 flex flex-col overflow-hidden bg-white"
        >

          {/* Header */}
          <DialogHeader className="border-b px-6 py-3 flex-none">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>File Manager</DialogTitle>
                <DialogDescription>Select files or upload new ones</DialogDescription>
              </div>
              {/* <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                <X />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-12 border-t flex-1 min-h-0">
            {/* Sidebar (hidden in search mode) */}
            {!searchMode && (
              <aside
                className="col-span-2 overflow-y-auto border-r p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                tabIndex={0}
                onWheel={(e) => {
                  (e.currentTarget as HTMLDivElement).scrollTop += e.deltaY
                }}
              >
                <div className="min-w-[200px]">
                  <CreateRootFolder />
                  <FolderTree />
                </div>
              </aside>
            )}

            {/* Content area */}
            <section className={`${searchMode ? "col-span-12" : "col-span-10"} p-2 relative flex flex-col min-h-0`}>
              {/* Floating Upload Button — stays below footer */}
              {activeFolderPath && !searchMode && (
                <Button
                  size="sm"
                  variant="default"
                  className="fixed bottom-15 right-8 rounded-full w-12 h-12 shadow-md flex items-center justify-center p-0 z-[71] bg-blue-600 hover:bg-blue-700"
                  title="Upload Files"
                  onClick={() => setOpenUploader(!openUploader)}
                >
                  {openUploader ? <X className="h-5 w-5 text-white" /> : <Upload className="h-5 w-5 text-white" />}
                </Button>
              )}

              {/* Top bar: view & search controls */}
              <div className="flex justify-between items-start border-b pb-2">
                <div />
                {/* Search input when search mode is active */}
                {searchMode && (
                  <div className="flex-shrink-0">
                    <div className="relative w-[400px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="e.g., /folder or /folder/image.jpg"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && searchInput.trim()) handleSearch()
                        }}
                        className="pl-10 pr-[90px]"
                        aria-label="Search files"
                        disabled={isSearching}
                      />
                      {/* Clear Button */}
                      {searchInput && !isSearching && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-[45px] top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                          onClick={() => {
                            setSearchInput("")
                            setSearchResults([])
                            setSearchQuery("")
                          }}
                          title="Clear search"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Search Button */}
                      <Button
                        onClick={handleSearch}
                        disabled={!searchInput.trim() || isSearching}
                        className="absolute right-[2px] top-1/2 -translate-y-1/2 h-8 px-3 rounded-md"
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="mt-2 text-sm font-medium text-blue-600">
                        {searchResults.length} {searchResults.length === 1 ? "file" : "files"} found
                      </div>
                    )}
                  </div>
                )}

                {/* View toggles */}
                <div className="flex justify-end items-end gap-2 mb-2 flex-shrink-0 pb-1.5">
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`cursor-pointer p-1.5 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600"
                        }`}
                      onClick={() => setViewMode("list")}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`cursor-pointer p-1.5 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600"
                        }`}
                      onClick={() => setViewMode("grid")}
                      title="Grid View"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`cursor-pointer p-1.5 ${searchMode ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600"}`}
                      onClick={toggleSearchMode}
                      title={searchMode ? "Exit Search Mode" : "Search Files"}
                      aria-label={searchMode ? "Exit search mode" : "Enter search mode"}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content scrollers */}
              {openUploader ? (
                <div className="flex-1 min-h-0">
                  <MultiSelectDropZone folderPath={activeFolderPath} maxFileSize={10} acceptedFileTypes="*/*" />
                </div>
              ) : (
                <>
                  {/* LIST view */}
                  {viewMode === "list" && (
                    <div
                      className="overflow-auto flex-1 p-2.5"
                      onWheel={(e) => {
                        (e.currentTarget as HTMLDivElement).scrollTop += e.deltaY
                      }}
                    >
                      <div className="grid grid-cols-12 border-b pb-2 text-sm font-medium text-gray-500">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2">Size</div>
                        <div className="col-span-3">Modified</div>
                        <div className="col-span-1">Actions</div>
                      </div>

                      <div>
                        {displayedFiles.length > 0 ? (
                          displayedFiles.map((file: FileItem, index: number) => {
                            const isDeleting = deletingFilePath === file.path
                            const isSelected = selectedFiles.some((f) => f.path === file.path)
                            return (
                              <div
                                key={`${file.path}-${index}`}
                                onClick={() => !isDeleting && toggleFileSelection({ name: file.name, path: file.path })}
                                className={`relative grid grid-cols-12 items-center border-b p-2 text-gray-700 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-blue-100" : ""
                                  } ${isDeleting ? "pointer-events-none opacity-60" : ""}`}
                                title={file.name}
                              >
                                {isDeleting && (
                                  <div
                                    className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
                                    aria-label="Deleting file"
                                  >
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                  </div>
                                )}

                                <div className="col-span-6 flex items-center truncate">
                                  <div className="relative h-10 w-16 border-2 rounded-md overflow-hidden flex items-center justify-center cursor-pointer">
                                    {getFileTypeFromName(file.name) === "image" ? (
                                      <>
                                        <Image
                                          src={getImageUrl(file.path) || `/images/${file.path}`}
                                          alt={file.name}
                                          className="h-full w-full object-cover rounded"
                                          width={400}
                                          height={400}
                                        />
                                        {isSelected && (
                                          <div className="absolute top-1 left-1 bg-white rounded-full p-[2px]">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center">
                                        {getFileIcon(file.name)}
                                        {isSelected && (
                                          <div className="absolute top-1 left-1 bg-white rounded-full p-[2px]">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="px-5 flex flex-col">
                                    <span className="truncate text-sm">{file.name}</span>
                                    <span className="truncate text-xs text-gray-400">{file.path}</span>
                                  </div>
                                </div>

                                <div className="col-span-2 text-sm">{(file.size / 1024).toFixed(2)} KB</div>
                                <div className="col-span-3 text-sm">{formatDate(file.modifiedAt)}</div>

                                <div className="col-span-1 flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                    onClick={(e) => handleDelete(file, e)}
                                    disabled={isDeleting}
                                    title="Delete file"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                    onClick={(e) => {
                                      if (getFileTypeFromName(file.name) === "image") {
                                        e.stopPropagation()
                                        openPreview(file, index)
                                      }
                                    }}
                                    disabled={isDeleting}
                                    title="Preview file"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            {searchMode && searchQuery ? `No files found matching "${searchQuery}"` : "No files found."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* GRID view */}
                  {viewMode === "grid" && (
                    <div
                      className="overflow-auto flex-1"
                      onWheel={(e) => {
                        (e.currentTarget as HTMLDivElement).scrollTop += e.deltaY
                      }}
                    >
                      <div
                        className="p-4"
                        style={{
                          columnCount: "auto",
                          columnWidth: "250px",
                          columnGap: "8px",
                        }}
                      >
                        {displayedFiles.length > 0 ? (
                          displayedFiles.map((file: FileItem, index: number) => {
                            const isDeleting = deletingFilePath === file.path
                            const isSelected = selectedFiles.some((f) => f.path === file.path)
                            return (
                              <div
                                key={`${file.path}-${index}`}
                                className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl break-inside-avoid ${isSelected ? "ring-2 ring-blue-500 shadow-md" : "hover:ring-2 hover:ring-gray-300"
                                  } ${isDeleting ? "pointer-events-none opacity-60" : ""}`}
                                onClick={() => !isDeleting && toggleFileSelection({ name: file.name, path: file.path })}
                                style={{ display: "inline-block", width: "100%" }}
                                title={file.name}
                              >
                                {isDeleting && (
                                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20" aria-label="Deleting file">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                  </div>
                                )}

                                {isSelected && (
                                  <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-0.5 shadow-md">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 left-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                  onClick={(e) => handleDelete(file, e)}
                                  disabled={isDeleting}
                                  title="Delete file"
                                >
                                  {isDeleting ? <Loader2 className="h-4 w-4 text-gray-500 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 left-12 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-green-50 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                  title="Preview file"
                                  disabled={isDeleting}
                                  onClick={(e) => {
                                    if (getFileTypeFromName(file.name) === "image") {
                                      e.stopPropagation()
                                      openPreview(file, index)
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <div className="w-full flex items-center justify-center bg-gray-50 relative">
                                  {getFileTypeFromName(file.name) === "image" ? (
                                    <Image
                                      src={getImageUrl(file.path) || `/images/${file.path}`}
                                      alt={file.name}
                                      className="w-full h-auto object-cover"
                                      width={400}
                                      height={400}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center gap-2 p-8">
                                      {getFileIcon(file.name)}
                                      <span className="text-xs text-gray-500 text-center">{file.name}</span>
                                    </div>
                                  )}

                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pb-2">
                                    <h3 className="font-semibold text-sm text-white text-wrap mb-1">{file.name}</h3>
                                    <p className="font-semibold text-xs text-white/80 text-wrap mb-1">{file.path}</p>
                                    <div className="flex items-center justify-between text-xs text-white/90">
                                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                                      <span>{formatDate(file.modifiedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center text-gray-400">
                            {searchMode && searchQuery ? `No files found matching "${searchQuery}"` : "No files found."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Footer: fixed, always visible, high z-index */}
          <div className="px-6 py-3 border-t bg-white flex justify-end gap-2 flex-none relative z-[72]">
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={onSelectCallBack}
              disabled={selectedFiles.length === 0}
              className="cursor-pointer"
            >
              Select {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </Button>
          </div>

          {/* Preview overlay: only on when previewFile exists; sits above everything */}
          {previewFile && (
            <div className="fixed inset-0 bg-black/75 z-[80] flex items-center justify-center" onClick={closePreview}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10"
                onClick={closePreview}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Previous */}
              {previewIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Next */}
              {previewIndex < displayedFiles.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Image */}
              <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4 relative" onClick={closePreview}>
                <Image
                  src={getImageUrl(previewFile.path) || `/images/${previewFile.path}`}
                  alt={previewFile.name}
                  className="max-w-full max-h-[80vh] object-contain"
                  width={1920}
                  height={1080}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="text-white text-center mt-2">
                  <h3 className="text-lg font-semibold mb-1">{previewFile.name}</h3>
                  <p className="font-semibold text-xs text-white/80 text-wrap mb-1">{previewFile.path}</p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span>{(previewFile.size / 1024).toFixed(2)} KB</span>
                    <span>•</span>
                    <span>{formatDate(previewFile.modifiedAt)}</span>
                    <span>•</span>
                    <span>
                      {previewIndex + 1} of {displayedFiles.length}
                    </span>
                  </div>
                </div>

                {/* Action buttons inside preview */}
                <div className="absolute -bottom-10 flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingFilePath === previewFile.path}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => handleDelete(previewFile, e)}
                    title="Delete file"
                  >
                    {deletingFilePath === previewFile.path ? (
                      <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingFilePath === previewFile.path}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFileSelection({ name: previewFile.name, path: previewFile.path })
                    }}
                  >
                    {deletingFilePath === previewFile.path ? (
                      <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                    ) : selectedFiles.some((f) => f.path === previewFile.path) ? (
                      <CircleCheckBig className="h-4 w-4" />
                    ) : (
                      <BoxSelect className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
