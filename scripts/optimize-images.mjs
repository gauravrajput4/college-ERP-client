import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const TARGET_DIRS = [path.join(ROOT, "public"), path.join(ROOT, "src", "assets")];
const VALID_EXT = new Set([".png", ".jpg", ".jpeg"]);
const SIZE_THRESHOLD = 100 * 1024;

const walk = async (dir) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(fullPath);
        return [fullPath];
      }),
    );
    return files.flat();
  } catch {
    return [];
  }
};

const optimizeFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!VALID_EXT.has(ext)) return null;

  const stat = await fs.stat(filePath);
  if (stat.size <= SIZE_THRESHOLD) return null;

  const outputPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(filePath).webp({ quality: 82 }).toFile(outputPath);

  return { filePath, outputPath, oldSize: stat.size };
};

const main = async () => {
  const files = (await Promise.all(TARGET_DIRS.map((dir) => walk(dir)))).flat();
  const results = [];
  for (const file of files) {
    const result = await optimizeFile(file);
    if (result) results.push(result);
  }

  if (!results.length) {
    console.log("No PNG/JPG files above 100KB found.");
    return;
  }

  results.forEach((result) => {
    console.log(`Converted: ${path.relative(ROOT, result.filePath)} -> ${path.relative(ROOT, result.outputPath)}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

