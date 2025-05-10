// app/api/og/route.tsx (for Next.js 13+ App Router)
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get data from URL parameters
  const title = searchParams.get('title') || 'Default Product';
  const description = searchParams.get('description') || 'Amazing product description';
  const price = searchParams.get('price') || '$99.99';
  
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '40px',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif',
        background: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
      }}>
        <h1 style={{ fontSize: '60px', margin: '0' }}>{title}</h1>
        <p style={{ fontSize: '30px', margin: '20px 0', color: '#666' }}>{description}</p>
        <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#e44d26' }}>{price}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
