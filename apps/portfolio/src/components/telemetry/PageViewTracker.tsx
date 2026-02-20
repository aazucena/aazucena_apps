import { useEffect } from "react";
// Import your telemetry utility functions
import {
  sendPageViewTelemetry,
  sendClientErrorTelemetry,
  sendInteractionTelemetry,
} from "~/lib/services/telemetry";
import { initPerformanceTracking } from "~/lib/services/performance";

// This component renders nothing visually (returns null), its purpose is side-effects.
export default function PageViewTracker() {
  // The useEffect hook runs on the client-side *after* the component mounts.
  useEffect(() => {
    // 1. Send Initial Page View Telemetry:
    // When this component first mounts on the client (i.e., the page initially loads or is navigated to),
    // we call sendPageViewTelemetry(). This records the first page view.
    sendPageViewTelemetry();
    initPerformanceTracking();

    // 2. Handle Astro Client-Side Page Transitions:
    // Astro's View Transitions API allows for SPA-like navigation without full page reloads
    // The 'astro:page-load' event fires whenever Astro navigates to a new page without a fu browser refresh.
    // We attach an event listener to this event, so that every time a client-side navigatio occurs,
    // a new page view telemetry event is sent.
    const handlePageLoad = () => {
      sendPageViewTelemetry();
    };
    document.addEventListener("astro:page-load", handlePageLoad);

    const handleGlobalClick = (event: MouseEvent) => {
      // Find the nearest element with data-track-id (checks parents too)
      const target = (event.target as HTMLElement).closest(
        "[data-track-id]",
      ) as HTMLElement;

      if (target) {
        const id = target.getAttribute("data-track-id") || "unknown";
        const action = target.getAttribute("data-track-action") || "click";

        // Collect any other data-track-* attributes as metadata
        const metadata: Record<string, string> = {};
        Array.from(target.attributes).forEach((attr) => {
          if (
            attr.name.startsWith("data-track-") &&
            attr.name !== "data-track-id" &&
            attr.name !== "data-track-action"
          ) {
            const key = attr.name.replace("data-track-", "");
            metadata[key] = attr.value;
          }
        });

        sendInteractionTelemetry(id, action, metadata);
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // 3. Global Client-Side Error Tracking:
    // We attach an event listener to the global 'error' event on the window object.
    // This catches any unhandled JavaScript errors that occur anywhere on the page.
    // When an error occurs, sendClientErrorTelemetry() is called, sending the error details to your API.
    const handleError = (event: ErrorEvent) => {
      // event.message: The error message (e.g., "Uncaught TypeError: Cannot read property 'foo' of undefined")
      // event.error?.stack: The stack trace, if available.
      // event.filename: The URL of the script where the error occurred.
      sendClientErrorTelemetry(
        event.message,
        event.error?.stack,
        event.filename,
      );
      // Returning false here (or using event.preventDefault()) can prevent default browser error
      // handling (e.g., logging to console, showing an error overlay), allowing your custom handler to take over.
      return false;
    };
    window.addEventListener("error", handleError);

    // 4. Cleanup on Component Unmount:
    // The return function of useEffect is a cleanup function.
    // When the component is removed from the DOM (e.g., if the layout itself is unmounted, though less common for a base layout),
    // these event listeners are removed to prevent memory leaks.
    return () => {
      document.removeEventListener("astro:page-load", handlePageLoad);
      window.removeEventListener("error", handleError);
    };
  }, []); // The empty dependency array `[]` ensures this useEffect runs only once after the initial render (mount) and cleanup runs only once on unmount.

  // This React component does not render any visible UI elements, hence it returns null.
  return null;
}
