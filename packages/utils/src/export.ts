/**
 * Utility functions for exporting SVG visualizations to PNG/SVG
 */

/**
 * Downloads an SVG element as an .svg file
 */
export function downloadSVG(svgElement: SVGSVGElement, fileName: string = 'visualization') {
  try {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Add namespaces if missing
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Add XML declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // Convert to blob
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${fileName}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error exporting SVG:', error);
  }
}

/**
 * Downloads an SVG element as a .png file
 */
export function downloadPNG(
  svgElement: SVGSVGElement,
  fileName: string = 'visualization',
  scale: number = 2,
) {
  try {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    const width = svgElement.width.baseVal.value || svgElement.getBoundingClientRect().width;
    const height = svgElement.height.baseVal.value || svgElement.getBoundingClientRect().height;

    canvas.width = width * scale;
    canvas.height = height * scale;

    const image = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      context.fillStyle = 'white'; // White background for transparency
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${fileName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    image.src = url;
  } catch (error) {
    console.error('Error exporting PNG:', error);
  }
}
