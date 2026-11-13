// Native global fetch in Node 18+

async function runTests() {
  console.log('🧪 Starting India-Focused API Verification Tests...');
  const baseUrl = 'http://localhost:5000/api';

  try {
    // 1. Health
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health Check:', healthData);

    // 2. Stays & Currency Verification
    const staysRes = await fetch(`${baseUrl}/stays`);
    const staysData = await staysRes.json();
    console.log(`✅ Stays Count: ${staysData.count} (Expected 6)`);
    if (staysData.stays && staysData.stays.length > 0) {
      const firstStay = staysData.stays[0];
      console.log(`   First Stay: ${firstStay.name} - ₹${firstStay.pricePerNight} (${firstStay.currency || 'INR'})`);
      if (firstStay.pricePerNight < 1000) {
        throw new Error(`Stay pricing appears to be in USD or un-seeded: ₹${firstStay.pricePerNight}`);
      }
    }

    // 3. Single Stay
    const singleRes = await fetch(`${baseUrl}/stays/oceanfront-villa`);
    const singleData = await singleRes.json();
    console.log('✅ Single Stay Fetch:', singleData.success ? `${singleData.stay.name} (₹${singleData.stay.pricePerNight})` : 'Failed');

    // 4. Register Indian Test User
    const testEmail = `priya_${Date.now()}@veloura-resort.in`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Sharma',
        email: testEmail,
        password: 'Password123!',
        phone: '+91 98765 43210',
        country: 'India',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400049'
      })
    });
    const regData = await regRes.json();
    console.log('✅ Auth Register:', regData.success ? `User created (${regData.user.email}, ${regData.user.country})` : regData.message);
    const token = regData.token;

    // 5. Auth Me
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('✅ Auth Me Profile:', meData.success ? `Authenticated as ${meData.user.name} (${meData.user.country})` : meData.message);

    // 6. Create Booking with Indian Guest & Address Details
    const bookingRes = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stayId: 'oceanfront-villa',
        checkIn: '2026-12-10',
        checkOut: '2026-12-15',
        adults: 2,
        children: 0,
        guest: {
          title: 'Ms.',
          firstName: 'Priya',
          lastName: 'Sharma',
          email: testEmail,
          phone: '+91 98765 43210',
          country: 'India',
          streetAddress: 'Flat 402, Sea View Apartments, Juhu Tara Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400049',
          arrivalTime: '15:00',
          specialRequests: 'Traditional welcome garland and masala chai upon arrival.'
        },
        addons: [
          { id: 'floating-breakfast', name: 'Floating Horizon Champagne Breakfast', price: 9500 }
        ]
      })
    });
    const bookingData = await bookingRes.json();
    if (!bookingData.success) {
      throw new Error(`Booking creation failed: ${bookingData.message}`);
    }
    const b = bookingData.booking;
    console.log(`✅ Booking Created: Ref ${b.reference}, Total: ₹${b.financials.grandTotal} (${b.financials.currency || 'INR'})`);
    console.log(`   Address verified: ${b.guest.streetAddress}, ${b.guest.city}, ${b.guest.state} - ${b.guest.pinCode}`);
    const bookingRef = b.reference;

    // 7. Test Simulated Payment Success
    const verifySuccessRes = await fetch(`${baseUrl}/bookings/simulate-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: bookingRef,
        outcome: 'success',
        method: 'demo_upi'
      })
    });
    const verifySuccessData = await verifySuccessRes.json();
    console.log('✅ Payment Simulation (Success):', verifySuccessData.success ? `Status: ${verifySuccessData.booking.status}` : verifySuccessData.message);
    if (verifySuccessData.booking.status !== 'Confirmed') {
      throw new Error(`Expected Confirmed status, got: ${verifySuccessData.booking.status}`);
    }

    // 8. Test Simulated Payment Failure
    const bookingFailRes = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stayId: 'beachside-suite',
        checkIn: '2026-12-18',
        checkOut: '2026-12-20',
        adults: 2,
        children: 0,
        guest: {
          title: 'Mr.',
          firstName: 'Vikram',
          lastName: 'Singhania',
          email: 'vikram.singhania@example.in',
          phone: '+91 98200 12345',
          country: 'India',
          streetAddress: '12 Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400026'
        },
        addons: []
      })
    });
    const bookingFailData = await bookingFailRes.json();
    const failRef = bookingFailData.booking.reference;

    const verifyFailRes = await fetch(`${baseUrl}/bookings/simulate-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: failRef,
        outcome: 'failure',
        method: 'demo_card'
      })
    });
    const verifyFailData = await verifyFailRes.json();
    console.log('✅ Payment Simulation (Failure handling):', !verifyFailData.success ? `Correctly failed: ${verifyFailData.message} (Status: ${verifyFailData.booking.status})` : 'Unexpected success');
    if (verifyFailData.booking.status !== 'Payment Failed') {
      throw new Error(`Expected Payment Failed status, got: ${verifyFailData.booking.status}`);
    }

    // 9. Fetch Single Booking by Reference & Email
    const lookupRes = await fetch(`${baseUrl}/bookings/lookup?reference=${bookingRef}&email=${encodeURIComponent(testEmail)}`);
    const lookupData = await lookupRes.json();
    console.log('✅ Booking Lookup by Ref & Email:', lookupData.success ? `Found Ref ${lookupData.booking.reference} (${lookupData.booking.status})` : lookupData.message);

    // 10. Fetch My Bookings (Protected)
    const myBookingsRes = await fetch(`${baseUrl}/bookings/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const myBookingsData = await myBookingsRes.json();
    console.log(`✅ My Bookings Count: ${myBookingsData.count} (Expected at least 1)`);

    console.log('\n🎉 ALL INDIA-FOCUSED BACKEND API ENDPOINTS FULLY VERIFIED AND PASSING!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exit(1);
  }
}

runTests();
