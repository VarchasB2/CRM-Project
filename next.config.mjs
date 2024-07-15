/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
          {
            source: "/",
            destination: "/dashboard",
            permanent: true,
          },
        ];
      },
      images:{
        domains:["kfxchmygpjswwnrxkxki.supabase.co"]
      }
};

export default nextConfig;
