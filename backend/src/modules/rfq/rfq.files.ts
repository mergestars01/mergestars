import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';

export function inspectRfqFile(
  file: Express.Multer.File | undefined,
  kind: string,
) {
  const bytes = file?.buffer;
  if (!bytes?.length || bytes.length > 20 * 1024 * 1024)
    throw new BadRequestException('File must be between 1 byte and 20 MB');
  let mime: string;
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    mime = 'image/png';
  else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    mime = 'image/jpeg';
  else if (
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  )
    mime = 'image/webp';
  else if (bytes.toString('ascii', 0, 4) === 'glTF') {
    if (
      bytes.length < 20 ||
      bytes.readUInt32LE(4) !== 2 ||
      bytes.readUInt32LE(8) !== bytes.length ||
      bytes.toString('ascii', 16, 20) !== 'JSON' ||
      bytes.readUInt32LE(12) > bytes.length - 20
    )
      throw new BadRequestException('Invalid GLB container');
    let json: { buffers?: { uri?: string }[]; images?: { uri?: string }[] };
    try {
      json = JSON.parse(
        bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)),
      );
    } catch {
      throw new BadRequestException('Invalid GLB JSON');
    }
    if (
      !json ||
      typeof json !== 'object' ||
      (json.buffers && !Array.isArray(json.buffers)) ||
      (json.images && !Array.isArray(json.images))
    )
      throw new BadRequestException('Invalid GLB resources');
    if (
      [...(json.buffers ?? []), ...(json.images ?? [])].some(
        (v) => !v || typeof v !== 'object' || v.uri,
      )
    )
      throw new BadRequestException('External GLB resources are not permitted');
    mime = 'model/gltf-binary';
  } else if (
    bytes.length >= 84 &&
    bytes.readUInt32LE(80) > 0 &&
    84 + bytes.readUInt32LE(80) * 50 === bytes.length
  )
    mime = 'model/stl';
  else if (kind === 'EVIDENCE' && bytes.toString('ascii', 0, 5) === '%PDF-')
    mime = 'application/pdf';
  else
    throw new BadRequestException(
      'Permitted files: JPEG, PNG, WebP, self-contained GLB, binary STL; PDF evidence for authorized participants',
    );
  if (
    (kind === 'REFERENCE' && !mime.startsWith('image/')) ||
    (kind === 'MODEL' && !mime.startsWith('model/'))
  )
    throw new BadRequestException('File does not match its declared purpose');
  const name =
    (file.originalname.split(/[\\/]/).pop() || 'attachment')
      .replace(/[\u0000-\u001f\u007f]/g, '')
      .slice(0, 160) || 'attachment';
  return {
    name,
    mime,
    size: bytes.length,
    hash: createHash('sha256').update(bytes).digest('hex'),
    bytes,
  };
}
