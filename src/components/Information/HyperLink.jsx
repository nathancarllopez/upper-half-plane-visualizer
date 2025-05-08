export default function HyperLink({ urlCode, openInNewTab = true, children }) {
  return (
    <a
      className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
      href={ URLS[urlCode] }
      target={ openInNewTab ? "_blank" : undefined }
      rel={ openInNewTab ? "noopener noreferrer" : undefined }
    >
      { children }
    </a>
  );
}

const URLS = {
  desmos: "https://www.desmos.com/calculator",
  elementsWiki: "https://en.wikipedia.org/wiki/Euclid%27s_Elements",
  elements: "http://aleph0.clarku.edu/~djoyce/java/elements/elements.html",
  halfPlane: "https://en.wikipedia.org/wiki/Poincar%C3%A9_half-plane_model",
  github: "https://github.com/nathancarllopez"  // To do: update this once published
};