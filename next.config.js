const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	productionBrowserSourceMaps: true,

	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},

	webpack(config) {	
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
}

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
//   })
//   module.exports = withBundleAnalyzer({})
