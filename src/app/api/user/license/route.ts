import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const imageSide = searchParams.get('imageSide'); // 'front' or 'back'

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!imageSide || (imageSide !== 'front' && imageSide !== 'back')) {
    return NextResponse.json({ error: 'Image side (front or back) is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
  }

  // Construct the directory path and full filename for the upload
  const directoryPath = `licenses/${imageSide}/`;
  const fullFilename = `${directoryPath}${filename}`;

  try {
    // Upload the file to the specified directory with public access
    const blob = await put(fullFilename, request.body as ReadableStream, {
      access: 'public',
    });

    // Respond with the full blob object, including the URL
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return NextResponse.json({ error: 'Failed to upload blob' }, { status: 500 });
  }
}
