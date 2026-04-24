import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const optimizedDir = path.join(publicDir, 'optimized');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const maxWidth = Number(process.env.IMAGE_PREVIEW_MAX_WIDTH ?? 1800);
const quality = Number(process.env.IMAGE_PREVIEW_QUALITY ?? 84);

async function collectImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (absolutePath === optimizedDir) continue;
      images.push(...(await collectImages(absolutePath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (imageExtensions.has(extension)) {
      images.push(absolutePath);
    }
  }

  return images;
}

function outputPathFor(sourcePath) {
  const relativePath = path.relative(publicDir, sourcePath);
  return path.join(optimizedDir, relativePath).replace(/\.(?:jpe?g|png|webp)$/i, '.webp');
}

async function optimizeImage(sourcePath) {
  const outputPath = outputPathFor(sourcePath);
  const metadata = await sharp(sourcePath).metadata();
  const pipeline = sharp(sourcePath, { limitInputPixels: false }).rotate();

  if (metadata.width && metadata.width > maxWidth) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await pipeline
    .webp({
      quality,
      effort: 5,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const [sourceStats, outputStats] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(outputPath),
  ]);

  return {
    sourceBytes: sourceStats.size,
    outputBytes: outputStats.size,
  };
}

const images = await collectImages(publicDir);
const results = [];

for (const image of images) {
  results.push(await optimizeImage(image));
}

const sourceTotal = results.reduce((sum, result) => sum + result.sourceBytes, 0);
const outputTotal = results.reduce((sum, result) => sum + result.outputBytes, 0);
const saved = sourceTotal - outputTotal;

const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

console.log(`Generated ${results.length} image previews.`);
console.log(`Original image weight: ${formatMb(sourceTotal)}`);
console.log(`Preview image weight:  ${formatMb(outputTotal)}`);
console.log(`Saved for page render: ${formatMb(saved)}`);
