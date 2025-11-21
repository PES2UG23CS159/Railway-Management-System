const db = require('./config/db');

async function createAdmin() {
  try {
    console.log('🔧 Creating Admin User...\n');

    // Check if admin exists
    const [existing] = await db.query("SELECT * FROM Passenger WHERE Email LIKE '%admin%'");
    
    if (existing.length > 0) {
      console.log('✅ Admin user already exists:');
      existing.forEach(admin => {
        console.log(`   Email: ${admin.Email}`);
        console.log(`   Name: ${admin.First_Name} ${admin.Last_Name}`);
        console.log(`   ID: ${admin.Passenger_ID}`);
      });
    } else {
      // Create admin passenger
      const [result] = await db.query(
        `INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email) 
         VALUES ('System', 'Admin', 35, 'Male', 'admin@railway.com')`
      );
      
      console.log('✅ Admin user created!');
      console.log(`   Email: admin@railway.com`);
      console.log(`   Name: System Admin`);
      console.log(`   ID: ${result.insertId}`);
      
      // Create railway card for admin
      const cardNumber = `RC-ADMIN-${Date.now()}`.substring(0, 20);
      await db.query(
        `INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID)
         VALUES (?, 'Admin', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 YEAR), 50000, ?)`,
        [cardNumber, result.insertId]
      );
      
      console.log(`✅ Railway card created: ${cardNumber}`);
      console.log(`   Balance: ₹50,000`);
    }

    console.log('\n📝 LOGIN CREDENTIALS:');
    console.log('   Email: admin@railway.com');
    console.log('   Password: (not required for testing)');
    console.log('\n✅ Admin setup complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
