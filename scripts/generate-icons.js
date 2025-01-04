const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Create a beer icon
const createIcon = async (size) => {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#4f46e5"/>
      
      <!-- Beer Mug -->
      <g transform="translate(${size * 0.2}, ${size * 0.15}) scale(${size * 0.0025})">
        <!-- Beer liquid -->
        <path d="M100 50 
                 L100 200 
                 Q100 230 130 230 
                 L170 230 
                 Q200 230 200 200 
                 L200 50 
                 Q200 20 170 20 
                 L130 20 
                 Q100 20 100 50" 
              fill="#fbbf24"/>
        
        <!-- Foam -->
        <path d="M100 50 
                 Q130 30 150 50 
                 Q170 30 200 50" 
              fill="white"/>
        
        <!-- Handle -->
        <path d="M200 80 
                 Q240 80 240 120 
                 L240 160 
                 Q240 200 200 200" 
              fill="none" 
              stroke="white" 
              stroke-width="20"/>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(ICONS_DIR, `icon-${size}.png`));
};

// Generate icons
async function generateIcons() {
  await createIcon(192);
  await createIcon(512);
  console.log('Beer icons generated successfully!');
}

generateIcons().catch(console.error); 