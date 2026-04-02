'use client';

import { Maximize2, Play, X } from "lucide-react";
import { useState } from "react";

export function VideoGalleryClient({ videos, instituteName }: { videos: any[], instituteName: string }) {
   const [selectedVideo, setSelectedVideo] = useState<any>(null);

   const getYouTubeThumbnail = (url: string) => {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
   };

   const getYouTubeEmbedUrl = (url: string) => {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
   };

   return (
      <>
         <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
               <div className="mb-12">
                  <h1 className="text-4xl font-bold mb-2">Video Gallery</h1>
                  <p className="text-muted-foreground">
                     Watch our collection of videos from {instituteName}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => {
                     const thumbnail = getYouTubeThumbnail(video.videoSrc);
                     return (
                        <button
                           key={video.id}
                           onClick={() => setSelectedVideo(video)}
                           className="group relative overflow-hidden rounded-lg bg-muted aspect-video cursor-pointer text-left hover:shadow-lg transition-shadow"
                        >
                           {thumbnail ? (
                              <img
                                 src={thumbnail}
                                 alt={video.title}
                                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                 loading="lazy"
                              />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                 <Play className="w-12 h-12 text-muted-foreground" />
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                              <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                           </div>
                           <div className="absolute inset-0 flex items-end">
                              <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                                 <p className="text-white font-medium text-sm">{video.title}</p>
                              </div>
                           </div>
                        </button>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* Video Modal */}
         {selectedVideo && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
               <div className="bg-background rounded-lg overflow-hidden max-w-4xl w-full">
                  <div className="relative aspect-video bg-black">
                     {getYouTubeEmbedUrl(selectedVideo.videoSrc) && (
                        <iframe
                           src={getYouTubeEmbedUrl(selectedVideo.videoSrc) || ''}
                           title={selectedVideo.title}
                           className="w-full h-full"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                        />
                     )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                     <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
                     <div className="flex gap-2">
                        <a
                           href={selectedVideo.videoSrc}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                           <Maximize2 className="w-4 h-4" />
                           Expand
                        </a>
                        <button
                           onClick={() => setSelectedVideo(null)}
                           className="inline-flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                        >
                           <X className="w-4 h-4" />
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
