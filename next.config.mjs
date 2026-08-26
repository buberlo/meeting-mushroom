const nextConfig = {
  reactStrictMode: true,

  // Keep native Node modules out of the server bundle so better-sqlite3
  // can be resolved from node_modules at runtime.
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
      });
    }

    return config;
  },
};

export default nextConfig;