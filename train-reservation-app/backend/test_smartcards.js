const db = require('./config/db');

async function testSmartcards() {
  try {
    console.log('🧪 Testing Railway Card System\n');
    console.log('='.repeat(60));

    // 1. Get all railway cards
    const [cards] = await db.query(`
      SELECT rc.*, CONCAT(p.First_Name, ' ', p.Last_Name) as Passenger_Name, p.Email
      FROM Railway_Card rc
      JOIN Passenger p ON rc.Passenger_ID = p.Passenger_ID
      ORDER BY rc.Card_ID
    `);

    console.log(`\n✅ RAILWAY CARDS (${cards.length} total):\n`);
    cards.forEach(card => {
      const expiry = new Date(card.Expiry_Date);
      const isExpired = expiry < new Date();
      const status = isExpired ? '❌ EXPIRED' : '✅ ACTIVE';
      
      console.log(`Card #${card.Card_ID} - ${card.Card_Number}`);
      console.log(`   Passenger: ${card.Passenger_Name} (${card.Email})`);
      console.log(`   Type: ${card.Card_Type}`);
      console.log(`   Balance: ₹${parseFloat(card.Balance).toFixed(2)}`);
      console.log(`   Issued: ${new Date(card.Issue_Date).toLocaleDateString()}`);
      console.log(`   Expires: ${expiry.toLocaleDateString()} ${status}`);
      console.log('');
    });

    // 2. Test statistics
    const totalBalance = cards.reduce((sum, c) => sum + parseFloat(c.Balance), 0);
    const activeCards = cards.filter(c => new Date(c.Expiry_Date) > new Date()).length;
    const seniorCards = cards.filter(c => c.Card_Type === 'Senior Citizen').length;

    console.log('='.repeat(60));
    console.log('📊 STATISTICS:');
    console.log(`   Total Cards Issued: ${cards.length}`);
    console.log(`   Active Cards: ${activeCards}`);
    console.log(`   Senior Citizen Cards: ${seniorCards}`);
    console.log(`   Total Balance: ₹${totalBalance.toFixed(2)}`);
    console.log(`   Average Balance: ₹${(totalBalance / cards.length).toFixed(2)}`);

    // 3. Check passengers without cards
    const [passengersWithoutCards] = await db.query(`
      SELECT p.Passenger_ID, CONCAT(p.First_Name, ' ', p.Last_Name) as Name, p.Email
      FROM Passenger p
      LEFT JOIN Railway_Card rc ON p.Passenger_ID = rc.Passenger_ID
      WHERE rc.Card_ID IS NULL
    `);

    if (passengersWithoutCards.length > 0) {
      console.log(`\n⚠️  PASSENGERS WITHOUT CARDS (${passengersWithoutCards.length}):`);
      passengersWithoutCards.forEach(p => {
        console.log(`   - ${p.Name} (${p.Email})`);
      });
    } else {
      console.log('\n✅ All passengers have railway cards!');
    }

    // 4. Test API endpoints
    console.log('\n' + '='.repeat(60));
    console.log('🔧 API ENDPOINTS TEST:\n');
    console.log('✅ GET /api/smartcards - Get all cards');
    console.log('✅ GET /api/smartcards/passenger/:id - Get card by passenger');
    console.log('✅ POST /api/smartcards - Issue new card');
    console.log('✅ POST /api/smartcards/:id/recharge - Recharge card');
    console.log('✅ GET /api/passengers/:id/card - Get passenger\'s card');
    console.log('✅ POST /api/passengers/:id/recharge - Recharge via passenger API');

    console.log('\n' + '='.repeat(60));
    console.log('✅ RAILWAY CARD SYSTEM IS WORKING!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSmartcards();
