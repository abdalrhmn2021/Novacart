/** @type {import('next').NextConfig} */
// The browser only talks to this Next.js app. Requests to /api/* are proxied to
// the Express backend, so the auth cookie is set on the frontend's own domain
// (a cookie set by a different domain would be blocked as third-party).
const API_URL = process.env.API_URL || "http://localhost:5000";

const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;