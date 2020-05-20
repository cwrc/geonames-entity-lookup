module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['./src/index.js'],
	coverageDirectory: './coverage',
	coverageThreshold: {
		global: {
			statements: 85,
			branches: 65,
			functions: 85,
			lines: 90,
		},
	},
	testMatch: ['**/test/**/*.[jt]s?(x)'],
};
