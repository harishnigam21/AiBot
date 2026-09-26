// next.config.mjs or next.config.js
/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: false, // Prevents useEffect from running twice in dev mode
  output: "standalone",
};

export default nextConfig;
