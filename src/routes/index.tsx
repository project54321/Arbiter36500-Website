import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uploaded HTML Preview" },
      { name: "description", content: "Live preview of the uploaded HTML file." },
      { property: "og:title", content: "Uploaded HTML Preview" },
      { property: "og:description", content: "Live preview of the uploaded HTML file." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/uploaded-preview.html"
      title="Uploaded HTML Preview"
      className="w-screen h-screen border-0 block"
    />
  );
}
