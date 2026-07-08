/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 영수증 이미지를 base64 data URL로 Server Action에 넘기므로 기본 1MB 제한을 늘린다.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

module.exports = nextConfig;
