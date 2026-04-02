import Breadcrumbs from "@/components/Breadcrumbs";
import VideoGallery from "@/components/VideoGallery";

export default function page() {
    return (
        <div>
            <Breadcrumbs pageTitle="ভিডিও গ্যালারী" />
            <div className="py-10">
                <div className="container mx-auto px-4">
                    <VideoGallery />
                </div>
            </div>
        </div>
    )
}
