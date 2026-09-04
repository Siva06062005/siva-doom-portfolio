import resumePdf from "../components/Siva Resume.pdf";
import { sfx } from "./sfx";

export { resumePdf };

/**
 * Direct 1-click download trigger for Siva's resume
 */
export function downloadResume() {
  try {
    sfx.playClick();
  } catch {
    // SFX optional
  }
  const link = document.createElement("a");
  link.href = resumePdf;
  link.download = "Siva Resume.pdf";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
