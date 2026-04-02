import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `https://storage.ighotok.com/images/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${url}`, response.status);
      return new NextResponse('Image not found', { status: 404 });
    }

    const contentType = response.headers.get('Content-Type');
    
    // Verify it's actually an image
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`Invalid content type: ${contentType} for ${url}`);
      return new NextResponse('Invalid image', { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}