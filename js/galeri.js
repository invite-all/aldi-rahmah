const namaFotoGaleri = [
    "prewed1_result.webp",
    "prewed2_result.webp",
    "prewed3_result.webp",
    "prewed4_result.webp",
    "prewed5_result.webp",
    "prewed6_result.webp",
    "prewed7_result.webp",
    "prewed8_result.webp",
    "prewed9_result.webp",
    "prewed10_result.webp",
    "prewed11_result.webp",
    "prewed12_result.webp",
    // "prewed13_result.webp",
    // "prewed14_result.webp",
    // "prewed15_result.webp",
    // "prewed16_result.webp",
    // "prewed17_result.webp"
];

const galeriAssetBase = new URL("../img/galeri/", document.currentScript.src);

function buatThumbnail(img) {
    if (img.dataset.thumbnailGenerated === "true") return;
    if (!img.complete || img.naturalWidth === 0) return;

    const aspectRatio = 2 / 3;
    const sourceRatio = img.naturalWidth / img.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.naturalWidth;
    let sourceHeight = img.naturalHeight;

    if (sourceRatio > aspectRatio) {
        sourceWidth = sourceHeight * aspectRatio;
        sourceX = (img.naturalWidth - sourceWidth) / 2;
    } else {
        sourceHeight = sourceWidth / aspectRatio;
        sourceY = img.naturalHeight - sourceHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 480;

    try {
        const context = canvas.getContext("2d");
        if (!context) {
            console.error("Tidak dapat membuat thumbnail galeri: Canvas 2D tidak tersedia.");
            return;
        }

        context.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
        img.dataset.thumbnailGenerated = "true";
        img.src = canvas.toDataURL("image/jpeg", 0.8);
    } catch (error) {
        console.error(`Gagal membuat thumbnail untuk ${img.dataset.fullSrc}.`, error);
    }
}

function renderGaleriOtomatis(totalFoto = namaFotoGaleri.length) {
    const container = document.getElementById("galeriGrid");
    if (!container) return;

    let htmlFoto = "";
    for (const [index, namaFoto] of namaFotoGaleri.slice(0, totalFoto).entries()) {
        const fullImageUrl = new URL(namaFoto, galeriAssetBase).href;
        htmlFoto += `
            <div class="galeri-item item-${index + 1} animasi-scroll animasi-zoom" onclick="bukaModal(this)">
                <img src="${fullImageUrl}" data-full-src="${fullImageUrl}" alt="Prewedding ${index + 1}" loading="lazy" decoding="async">
            </div>
        `;
    }

    container.innerHTML = htmlFoto;
    for (const img of container.querySelectorAll("img")) {
        img.addEventListener("load", function () {
            buatThumbnail(img);
        }, { once: true });

        if (img.complete && img.naturalWidth > 0) {
            buatThumbnail(img);
        }

        img.addEventListener("error", function () {
            console.error(`Gagal memuat foto galeri: ${img.dataset.fullSrc}.`);
        }, { once: true });
    }
}

renderGaleriOtomatis();