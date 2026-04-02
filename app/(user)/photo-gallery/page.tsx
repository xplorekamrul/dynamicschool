import Breadcrumbs from "@/components/Breadcrumbs";
import PhotoGallery from "@/components/PhotoGallery";

export default function page() {
    return (
        <>
            <Breadcrumbs pageTitle="ফটো গ্যালারী" />
            <div className="py-10">
                <div className="container mx-auto px-4">
                    <PhotoGallery />
                </div>
            </div>
        </>
    )
}
