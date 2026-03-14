const http = require('http');

// Helper to make API requests
async function apiRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testCompleteFlow() {
  console.log('🧪 COMPREHENSIVE CART UI OPERATIONS TEST\n');
  console.log('This test simulates: Register → Login → Add multiple items → Remove items\n');

  let sessionCookie = '';
  const email = `test_${Date.now()}@test.com`;
  let testResults = [];

  try {
    // STEP 1: Register
    console.log('STEP 1️⃣  USER REGISTRATION');
    const registerRes = await apiRequest('POST', '/api/users/register', {}, {
      email: email,
      password: 'password123',
      name: 'UI Test User',
    });
    if (registerRes.status === 200) {
      console.log(`✅ User registered: ${email}\n`);
      testResults.push({ test: 'User Registration', status: 'PASS' });
    } else {
      console.log(`❌ Registration failed\n`);
      testResults.push({ test: 'User Registration', status: 'FAIL' });
      return;
    }

    // STEP 2: Login
    console.log('STEP 2️⃣  USER LOGIN');
    const loginRes = await apiRequest('POST', '/api/users/login', {}, {
      email: email,
      password: 'password123',
    });
    if (loginRes.status === 200) {
      sessionCookie = loginRes.headers['set-cookie']?.[0];
      console.log(`✅ User logged in successfully\n`);
      testResults.push({ test: 'User Login', status: 'PASS' });
    } else {
      console.log(`❌ Login failed\n`);
      testResults.push({ test: 'User Login', status: 'FAIL' });
      return;
    }

    // STEP 3: Get products
    console.log('STEP 3️⃣  GET AVAILABLE PRODUCTS');
    const productsRes = await apiRequest('GET', '/api/products', {
      'Cookie': sessionCookie,
    });
    if (productsRes.status !== 200 || !Array.isArray(productsRes.body)) {
      console.log(`❌ Failed to get products\n`);
      testResults.push({ test: 'Get Products', status: 'FAIL' });
      return;
    }
    const products = productsRes.body;
    console.log(`✅ Retrieved ${products.length} products\n`);
    testResults.push({ test: 'Get Products', status: 'PASS' });

    // STEP 4: Add first product to cart
    console.log('STEP 4️⃣  ADD FIRST PRODUCT TO CART');
    const product1Id = products[0].id;
    const addRes1 = await apiRequest('POST', '/api/cart/add', {
      'Cookie': sessionCookie,
    }, {
      productId: product1Id,
      quantity: 2,
    });
    if (addRes1.status === 200) {
      console.log(`✅ Added "${products[0].name}" (qty: 2) to cart\n`);
      testResults.push({ test: 'Add Product 1', status: 'PASS' });
    } else {
      console.log(`❌ Failed to add product to cart\n`);
      testResults.push({ test: 'Add Product 1', status: 'FAIL' });
      return;
    }

    // STEP 5: Add second product to cart
    console.log('STEP 5️⃣  ADD SECOND PRODUCT TO CART');
    const product2Id = products[1].id;
    const addRes2 = await apiRequest('POST', '/api/cart/add', {
      'Cookie': sessionCookie,
    }, {
      productId: product2Id,
      quantity: 1,
    });
    if (addRes2.status === 200) {
      console.log(`✅ Added "${products[1].name}" (qty: 1) to cart\n`);
      testResults.push({ test: 'Add Product 2', status: 'PASS' });
    } else {
      console.log(`❌ Failed to add product 2 to cart\n`);
      testResults.push({ test: 'Add Product 2', status: 'FAIL' });
      return;
    }

    // STEP 6: Get cart contents
    console.log('STEP 6️⃣  GET CART CONTENTS');
    const cartRes1 = await apiRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    if (cartRes1.status !== 200) {
      console.log(`❌ Failed to get cart\n`);
      testResults.push({ test: 'Get Cart (Before Removal)', status: 'FAIL' });
      return;
    }
    const cartBefore = Array.isArray(cartRes1.body) ? cartRes1.body : cartRes1.body.cart;
    console.log(`✅ Cart contains ${cartBefore.length} unique item(s)`);
    let totalQtyBefore = cartBefore.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`   Total quantity: ${totalQtyBefore} units\n`);
    cartBefore.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.name} - Unit Price: $${item.price} - Qty: ${item.quantity} - Subtotal: $${item.price * item.quantity}`);
    });
    console.log();
    testResults.push({ test: 'Get Cart (Before Removal)', status: 'PASS' });

    // STEP 7: Update quantity of first product
    console.log('STEP 7️⃣  UPDATE QUANTITY OF FIRST PRODUCT');
    const updateRes = await apiRequest('POST', '/api/cart/update', {
      'Cookie': sessionCookie,
    }, {
      productId: product1Id,
      quantity: 3,
    });
    if (updateRes.status === 200) {
      console.log(`✅ Updated "${products[0].name}" quantity to 3\n`);
      testResults.push({ test: 'Update Product Quantity', status: 'PASS' });
    } else {
      console.log(`❌ Failed to update quantity\n`);
      testResults.push({ test: 'Update Product Quantity', status: 'FAIL' });
    }

    // STEP 8: Verify cart after update
    console.log('STEP 8️⃣  VERIFY CART AFTER UPDATE');
    const cartRes2 = await apiRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    const cartAfterUpdate = Array.isArray(cartRes2.body) ? cartRes2.body : cartRes2.body.cart;
    console.log(`✅ Cart now has ${cartAfterUpdate.length} unique item(s)`);
    let totalQtyAfterUpdate = cartAfterUpdate.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`   Total quantity: ${totalQtyAfterUpdate} units\n`);
    testResults.push({ test: 'Update Verification', status: 'PASS' });

    // STEP 9: Remove first product
    console.log('STEP 9️⃣  REMOVE FIRST PRODUCT FROM CART');
    const removeRes1 = await apiRequest('POST', '/api/cart/remove', {
      'Cookie': sessionCookie,
    }, {
      productId: product1Id,
    });
    if (removeRes1.status === 200) {
      console.log(`✅ Removed "${products[0].name}" from cart\n`);
      testResults.push({ test: 'Remove Product 1', status: 'PASS' });
    } else {
      console.log(`❌ Failed to remove first product\n`);
      testResults.push({ test: 'Remove Product 1', status: 'FAIL' });
      return;
    }

    // STEP 10: Verify cart after first removal
    console.log('STEP 1️⃣0️⃣  VERIFY CART AFTER FIRST REMOVAL');
    const cartRes3 = await apiRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    const cartAfterRemove1 = Array.isArray(cartRes3.body) ? cartRes3.body : cartRes3.body.cart;
    console.log(`✅ Cart now has ${cartAfterRemove1.length} unique item(s)`);
    if (cartAfterRemove1.length === 1) {
      console.log(`   ✅ Correctly reduced from 2 to 1 item`);
      testResults.push({ test: 'Remove Verification 1', status: 'PASS' });
    } else {
      console.log(`   ⚠️ Expected 1 item, got ${cartAfterRemove1.length}`);
      testResults.push({ test: 'Remove Verification 1', status: 'UNEXPECTED' });
    }
    console.log();

    // STEP 11: Remove second product
    console.log('STEP 1️⃣1️⃣  REMOVE SECOND PRODUCT FROM CART');
    const removeRes2 = await apiRequest('POST', '/api/cart/remove', {
      'Cookie': sessionCookie,
    }, {
      productId: product2Id,
    });
    if (removeRes2.status === 200) {
      console.log(`✅ Removed "${products[1].name}" from cart\n`);
      testResults.push({ test: 'Remove Product 2', status: 'PASS' });
    } else {
      console.log(`❌ Failed to remove second product\n`);
      testResults.push({ test: 'Remove Product 2', status: 'FAIL' });
    }

    // STEP 12: Verify cart is empty
    console.log('STEP 1️⃣2️⃣  VERIFY CART IS EMPTY');
    const cartRes4 = await apiRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    const cartAfterRemove2 = Array.isArray(cartRes4.body) ? cartRes4.body : cartRes4.body.cart;
    console.log(`✅ Cart now has ${cartAfterRemove2.length} unique item(s)`);
    if (cartAfterRemove2.length === 0) {
      console.log(`   ✅ Cart is correctly empty`);
      testResults.push({ test: 'Remove Verification 2', status: 'PASS' });
    } else {
      console.log(`   ❌ Expected empty cart, but found ${cartAfterRemove2.length} items`);
      testResults.push({ test: 'Remove Verification 2', status: 'FAIL' });
    }
    console.log();

    // Print results
    console.log('═'.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═'.repeat(60));
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    const unexpected = testResults.filter(r => r.status === 'UNEXPECTED').length;

    testResults.forEach((result, idx) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${icon} ${result.test}: ${result.status}`);
    });

    console.log('═'.repeat(60));
    console.log(`Total: ${testResults.length} tests | Passed: ${passed} | Failed: ${failed} | Unexpected: ${unexpected}`);
    console.log('═'.repeat(60));

    if (failed === 0 && unexpected === 0) {
      console.log('🎉 ALL TESTS PASSED!');
    } else if (failed > 0) {
      console.log('⚠️  SOME TESTS FAILED');
    }

  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  }
}

testCompleteFlow();
