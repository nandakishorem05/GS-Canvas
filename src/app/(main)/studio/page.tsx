import { StudioEditor } from "@/components/studio/studio-editor";

export const metadata = {
  title: "Custom Artwork Studio | GS Canvas",
  description: "Upload your image and create custom premium wall décor.",
};

export default function StudioPage() {
  return (
    <div className="pt-0"> {/* Override pt-20 from layout since studio needs full height */}
      <StudioEditor />
    </div>
  );
}
