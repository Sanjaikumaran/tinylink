function downloadQR(code: string, svgSelector = "#qr-wrapper svg") {
  const svg = document.querySelector<SVGSVGElement>(svgSelector);
  if (!svg) return false;

  const serializer = new XMLSerializer();
  const svgData = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const pngFile = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = pngFile;
    a.download = `${code}-tinylink-qr.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  img.src = url;
  return true;
}

function copyToClipboard(text: string) {
  if (!navigator.clipboard) return false;
  navigator.clipboard.writeText(text);
  return true;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

function shareLink(fullURL: string | undefined) {
  if (!fullURL) return "Link not found";
  if (navigator.share) {
    navigator.share({
      title: "Short Link",
      url: fullURL,
    });
    return "Link shared";
  } else {
    return "Sharing not supported on this device";
  }
}

export { downloadQR, copyToClipboard, formatDate, shareLink };
