/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["pdf-parse"],
  async redirects() {
    // The old site called the work page /projects.
    return [{ source: "/projects", destination: "/work", permanent: true }];
  },
};

export default nextConfig;
