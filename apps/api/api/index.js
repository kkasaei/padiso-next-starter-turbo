// Vercel serverless entry point
// This imports the pre-built lambda handler
module.exports = require('../dist/lambda').default;
