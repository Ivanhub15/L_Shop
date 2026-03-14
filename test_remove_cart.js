const http = require('http');

// Test sequence: login -> get products -> add to cart -> view cart -> remove from cart

async function makeRequest(method, path, headers = {}, body = null) {
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

async function runTests() {
  console.log('🧪 Testing Cart Remove Functionality\n');

  let sessionCookie = '';
  let productId = '';
  let cartBefore = null;
  let cartAfter = null;

  try {
    // 1. Register a test user
    console.log('1️⃣  Registering test user...');
    const testEmail = `test_${Date.now()}@test.com`;
    const registerRes = await makeRequest('POST', '/api/users/register', {}, {
      email: testEmail,
      password: 'password123',
      name: 'Test User',
    });
    console.log(`   Status: ${registerRes.status}`);
    console.log(`   Response: ${JSON.stringify(registerRes.body).substring(0, 100)}...`);
    if (registerRes.status !== 201 && registerRes.status !== 200) {
      console.log(`   ❌ Registration failed: ${JSON.stringify(registerRes.body)}`);
      return;
    }
    console.log(`   ✅ User registered successfully\n`);

    // 2. Login to get session cookie
    console.log('2️⃣  Logging in...');
    const loginRes = await makeRequest('POST', '/api/users/login', {}, {
      email: testEmail,
      password: 'password123',
    });
    if (loginRes.status !== 200) {
      console.log(`   ❌ Login failed: ${JSON.stringify(loginRes.body)}`);
      return;
    }
    sessionCookie = loginRes.headers['set-cookie']?.[0];
    console.log(`   ✅ Logged in successfully`);
    console.log(`   Session cookie: ${sessionCookie?.substring(0, 50)}...\n`);

    // 3. Get products list
    console.log('3️⃣  Getting products list...');
    const productsRes = await makeRequest('GET', '/api/products', {
      'Cookie': sessionCookie,
    });
    if (productsRes.status !== 200 || !Array.isArray(productsRes.body) || productsRes.body.length === 0) {
      console.log(`   ❌ Failed to get products: ${JSON.stringify(productsRes.body)}`);
      return;
    }
    const productsList = productsRes.body;
    productId = productsList[0].id;
    console.log(`   ✅ Got ${productsList.length} products`);
    console.log(`   Using product: ${productsList[0].name} (ID: ${productId})\n`);

    // 4. Add product to cart
    console.log('4️⃣  Adding product to cart...');
    const addRes = await makeRequest('POST', '/api/cart/add', {
      'Cookie': sessionCookie,
    }, {
      productId: productId,
      quantity: 2,
    });
    if (addRes.status !== 200) {
      console.log(`   ❌ Failed to add to cart: ${JSON.stringify(addRes.body)}`);
      return;
    }
    console.log(`   ✅ Added to cart with quantity: 2\n`);

    // 5. Get cart before removal
    console.log('5️⃣  Getting cart contents BEFORE removal...');
    const cartBeforeRes = await makeRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    console.log(`   Response: ${JSON.stringify(cartBeforeRes.body).substring(0, 100)}`);
    if (cartBeforeRes.status !== 200) {
      console.log(`   ❌ Failed to get cart: ${JSON.stringify(cartBeforeRes.body)}`);
      return;
    }
    cartBefore = Array.isArray(cartBeforeRes.body) ? cartBeforeRes.body : cartBeforeRes.body.cart;
    console.log(`   ✅ Cart contains ${cartBefore.length} item(s)`);
    cartBefore.forEach((item, idx) => {
      console.log(`      ${idx + 1}. ${item.name} - Qty: ${item.quantity} - Price: $${item.price}`);
    });
    console.log();

    // 6. Remove product from cart
    console.log('6️⃣  Removing product from cart...');
    const removeRes = await makeRequest('POST', '/api/cart/remove', {
      'Cookie': sessionCookie,
    }, {
      productId: productId,
    });
    if (removeRes.status !== 200) {
      console.log(`   ❌ Failed to remove from cart: ${JSON.stringify(removeRes.body)}`);
      return;
    }
    console.log(`   ✅ Product removed successfully\n`);

    // 7. Get cart after removal
    console.log('7️⃣  Getting cart contents AFTER removal...');
    const cartAfterRes = await makeRequest('GET', '/api/cart', {
      'Cookie': sessionCookie,
    });
    if (cartAfterRes.status !== 200) {
      console.log(`   ❌ Failed to get cart: ${JSON.stringify(cartAfterRes.body)}`);
      return;
    }
    cartAfter = Array.isArray(cartAfterRes.body) ? cartAfterRes.body : cartAfterRes.body.cart;
    console.log(`   ✅ Cart contains ${cartAfter.length} item(s)`);
    if (cartAfter.length > 0) {
      cartAfter.forEach((item, idx) => {
        console.log(`      ${idx + 1}. ${item.name} - Qty: ${item.quantity} - Price: $${item.price}`);
      });
    } else {
      console.log(`      (empty)`);
    }
    console.log();

    // Verify
    console.log('📊 VERIFICATION:');
    console.log(`   Items before removal: ${cartBefore.length}`);
    console.log(`   Items after removal: ${cartAfter.length}`);
    
    if (cartBefore.length > 0 && cartAfter.length === cartBefore.length - 1) {
      console.log(`   ✅ SUCCESS: Item correctly removed from cart!`);
    } else if (cartAfter.length === 0 && cartBefore.length === 1) {
      console.log(`   ✅ SUCCESS: Last item correctly removed from cart!`);
    } else {
      console.log(`   ❌ FAILED: Cart state incorrect after removal`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
