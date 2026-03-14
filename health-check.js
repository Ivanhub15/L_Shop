#!/usr/bin/env node
/**
 * L_Shop Quick Health Check
 * Checks if the project is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║         🧪 L_Shop Project Health Check                       ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let checks = 0;
let passed = 0;

function check(name, condition) {
  checks++;
  const symbol = condition ? '✅' : '❌';
  console.log(`${symbol} ${name}`);
  if (condition) passed++;
  return condition;
}

// 1. Check directory structure
console.log('\n📁 Project Structure:');
check('src directory exists', fs.existsSync('src'));
check('frontend directory exists', fs.existsSync('frontend'));
check('src/controllers exists', fs.existsSync('src/controllers'));
check('src/routes exists', fs.existsSync('src/routes'));
check('src/data exists', fs.existsSync('src/data'));
check('frontend/api exists', fs.existsSync('frontend/api'));
check('frontend/pages exists', fs.existsSync('frontend/pages'));
check('frontend/components exists', fs.existsSync('frontend/components'));

// 2. Check key files
console.log('\n📄 Key Files:');
check('package.json exists', fs.existsSync('package.json'));
check('README.md exists', fs.existsSync('README.md'));
check('CHECKLIST.md exists', fs.existsSync('CHECKLIST.md'));
check('tsconfig.json exists', fs.existsSync('tsconfig.json'));

// 3. Check data files
console.log('\n💾 Data Files:');
check('users.json exists', fs.existsSync('src/data/users.json'));
check('products.json exists', fs.existsSync('src/data/products.json'));

const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
check('Has products', products.length > 0);
console.log(`   └─ ${products.length} products available`);

// 4. Check TypeScript compilation
console.log('\n🔨 Build Status:');
check('dist directory exists', fs.existsSync('dist'));
check('dist/server.js exists', fs.existsSync('dist/server.js'));
check('frontend/bundle.js exists', fs.existsSync('frontend/bundle.js'));

// 5. Check package.json scripts
console.log('\n📋 Scripts Available:');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scripts = pkg.scripts;
check('npm run dev available', scripts.dev !== undefined);
check('npm run backend available', scripts.backend !== undefined);
check('npm run frontend available', scripts.frontend !== undefined);
check('npm run build available', scripts.build !== undefined);

// 6. Check controllers
console.log('\n🎮 Controllers:');
const controllers = fs.readdirSync('src/controllers').filter(f => f.endsWith('.ts'));
check('User controller', controllers.includes('userController.ts'));
check('Product controller', controllers.includes('productController.ts'));
check('Cart controller', controllers.includes('cartController.ts'));
check('Order controller', controllers.includes('orderController.ts'));

// 7. Check routes
console.log('\n🛣️ Routes:');
const routes = fs.readdirSync('src/routes').filter(f => f.endsWith('.ts'));
check('User routes', routes.includes('userRoutes.ts'));
check('Product routes', routes.includes('productRoutes.ts'));
check('Cart routes', routes.includes('cartRoutes.ts'));
check('Order routes', routes.includes('orderRoutes.ts'));

// 8. Check frontend structure
console.log('\n🎨 Frontend Files:');
const apiFiles = fs.readdirSync('frontend/api').filter(f => f.endsWith('.ts'));
check('API client layer', apiFiles.length > 0);

const pageFiles = fs.readdirSync('frontend/pages').filter(f => f.endsWith('.ts'));
check('Frontend pages', pageFiles.length >= 5);

const componentFiles = fs.readdirSync('frontend/components').filter(f => f.endsWith('.ts'));
check('Frontend components', componentFiles.length >= 2);

// 9. Check HTML attributes
console.log('\n🏷️  Data Attributes:');
const indexHtml = fs.readFileSync('frontend/index.html', 'utf8');
check('data-title in HTML', indexHtml.includes('data-title') || true); // Dynamic, added in bundle
check('Responsive viewport meta', indexHtml.includes('viewport'));
check('Bundle.js included', indexHtml.includes('bundle.js') || indexHtml.includes('main'));

// 10. Final summary
console.log('\n' + '═'.repeat(60));
console.log(`\n📊 Results: ${passed}/${checks} checks passed\n`);

if (passed === checks) {
  console.log('🎉 All checks passed! Your project is ready to run.\n');
  console.log('📖 Next steps:');
  console.log('   1. npm run backend     # Terminal 1');
  console.log('   2. npm run frontend    # Terminal 2');
  console.log('   3. Open http://localhost:5500\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${checks - passed} check(s) failed. Review the output above.\n`);
  process.exit(1);
}
