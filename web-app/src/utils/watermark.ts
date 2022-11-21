export function appendWatermark(doc: Document) {
    let watermark = document.createElement("div");
    //@ts-ignore
    watermark.style = "font-size: 10px; color: #999; text-align: right; margin-top: 15px;";
    watermark.textContent = "https://dimusic.github.io/chinese-text-analyzer";
    Array.from(doc.getElementsByClassName("text-analyzer-output")).forEach((el) => el.appendChild(watermark));
}
