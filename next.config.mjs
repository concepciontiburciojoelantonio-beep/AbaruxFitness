/** @type {import('next').NextConfig} */
  const nextConfig = {
     typescript: {
       ignoreBuildErrors: true,
   }, 
   images: {
     unoptimized: true,
   },
  }
   
export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
//   allowedDevOrigins: [
//     'http://localhost:7171',
//     'http://127.0.0.1:7171',
//     'http://179.53.19.198:7171'
//   ],
// }

// export default nextConfig
