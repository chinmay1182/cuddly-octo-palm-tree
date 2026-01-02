import path from 'path';
import fs from 'fs';

export async function handleFileUpload(file: File, subdir: string = 'uploads'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const ext = path.extname(cleanName) || '.jpg';
    const basename = path.basename(cleanName, ext);

    const filename = `${basename}-${timestamp}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', subdir);
    const uploadPath = path.join(uploadDir, filename);

    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.writeFile(uploadPath, buffer);

    return `/${subdir}/${filename}`;
}

export async function deleteFile(filePath: string) {
    if (!filePath) return;
    try {
        const fullPath = path.join(process.cwd(), 'public', filePath);
        await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}
