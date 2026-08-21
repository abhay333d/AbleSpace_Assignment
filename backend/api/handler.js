/**
 * Vercel Serverless Function Entry Point
 *
 * This is a thin JavaScript wrapper that delegates to the compiled
 * NestJS handler in dist/. The `vercel-build` script in package.json
 * runs `nest build` first, which compiles backend/api/index.ts to
 * backend/dist/api/index.js before this file is deployed.
 *
 * Using a .js entry point (instead of .ts) means @vercel/node doesn't
 * try to bundle the TypeScript itself, which caused "Cannot find module
 * '@nestjs/core'" due to nft being unable to trace NestJS's dynamic requires.
 */
'use strict';

module.exports = require('../dist/api/index');
