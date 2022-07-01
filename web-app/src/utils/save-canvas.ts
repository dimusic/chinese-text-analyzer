export function saveCanvasAsImage(canvas: HTMLCanvasElement, fileName: string) {
    let a = document.createElement('a');
    a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    a.download = `${fileName}-analyzed.png`;
    a.click();
}
