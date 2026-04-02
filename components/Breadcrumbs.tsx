interface BreadcrumbsProps {
  pageTitle?: string;
}

export default function Breadcrumbs({ pageTitle }: BreadcrumbsProps) {
  return (
    pageTitle && 
    <div className="py-5 lg:py-8 bg-pcolor">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-2xl lg:text-3xl font-semibold">{pageTitle}</h1>
      </div>
    </div>
  );
}
