// pages/api/product-image.js
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import path from 'path';

// Load font data
const fontPath = path.join(process.cwd(), 'fonts', 'Inter-Regular.ttf');
const fontData = readFileSync(fontPath);

export default async function handler(req, res) {
  const { title, description, price, imageUrl } = req.query;
  
  // Create product card with React syntax
  const svg = await satori(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '40px',
      background: 'white',
    }}>
      {imageUrl && (
        <img 
          src={imageUrl}
          style={{ width: '300px', height: '300px', objectFit: 'contain' }}
        />
      )}
      <h1 style={{ fontSize: '48px', margin: '20px 0 0' }}>{title || 'Product Title'}</h1>
      <p style={{ fontSize: '24px', color: '#666' }}>{description || 'Product description'}</p>
      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#e44d26' }}>{price || '$0.00'}</p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
  
  // For SVG preview, just return the SVG with proper headers
  if (req.query.format === 'svg') {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(svg);
  }
  
  // For PNG export, convert using resvg-js
  const resvg = new Resvg(svg, {
    background: 'white',
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  
  // Return PNG with proper headers
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.status(200).send(pngBuffer);
} :antCitation[]{citations="0373ca6c-dd23-42d1-ab64-147df264a84e"}
