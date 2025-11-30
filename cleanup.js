// Run this once to clean up database
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete users with null userName
    const result = await mongoose.connection.db.collection('users').deleteMany({
      $or: [{ userName: null }, { username: null }]
    });
    
    console.log(`Deleted ${result.deletedCount} users with null userName`);
    
    // Drop old indexes if they exist
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('Dropped old username index');
    } catch (err) {
      console.log('username index not found (that\'s ok)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB();