export default function CatalogHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-normal text-foreground">
          Catalog
        </h1>
        <p className="text-lg font-light text-muted-foreground">
          View and manage product catalog
        </p>
      </div>
    </div>
  );
}