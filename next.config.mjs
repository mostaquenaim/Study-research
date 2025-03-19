/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'flagcdn.com', // Add your image source domains here
        // You can add any other domains from which you load images
      ],
      formats: ['image/webp', 'image/avif'], // Enable WebP and AVIF formats for optimization
    },
  };
  
  export default nextConfig;
  