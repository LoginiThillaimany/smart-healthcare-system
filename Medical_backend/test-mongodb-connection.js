const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * MongoDB Atlas Connection Test Script
 * This script tests various connection scenarios and provides detailed debugging
 */

console.log('🧪 MongoDB Atlas Connection Test');
console.log('='.repeat(50));

// Test different URI formats
const testConnections = [
  {
    name: 'Primary MongoDB URI',
    uri: process.env.MONGODB_URI
  },
  {
    name: 'Alternative Mongo URI',
    uri: process.env.MONGO_URI
  },
  {
    name: 'Fallback Local MongoDB',
    uri: 'mongodb://localhost:27017/healthcare_system_test'
  }
];

async function testConnection(name, uri) {
  if (!uri) {
    console.log(`❌ ${name}: URI not found in environment variables`);
    return false;
  }

  console.log(`\n🔍 Testing: ${name}`);
  console.log(`📍 URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials

  try {
    // Create a new connection for testing (Mongoose 7+ compatible)
    const connection = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
      socketTimeoutMS: 45000, // 45 seconds of inactivity before closing socket
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 5, // Maintain up to 5 socket connections for testing
      bufferCommands: false // Disable mongoose buffering
    });

    // Set up event listeners
    connection.on('connected', () => {
      console.log('✅ Connected to MongoDB');
    });

    connection.on('error', (err) => {
      console.log('❌ Connection error:', err.message);
    });

    connection.on('disconnected', () => {
      console.log('🔌 Disconnected from MongoDB');
    });

    // Wait for connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout after 10 seconds'));
      }, 10000);

      connection.once('open', () => {
        clearTimeout(timeout);
        console.log('✅ Database connection established successfully');
        console.log(`📊 Database: ${connection.name || 'default'}`);
        console.log(`🔗 Host: ${connection.host}`);
        console.log(`📡 Port: ${connection.port}`);
        console.log(`🏷️  Ready State: ${connection.readyState}`);
        resolve();
      });

      connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Test a simple operation
    const testCollection = connection.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful' 
    });
    console.log('✅ Test document inserted successfully');

    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');

    // Close connection
    await connection.close();
    console.log('✅ Connection closed successfully');
    
    return true;

  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.log('💡 Fix: Check your username and password in the MongoDB URI');
      console.log('💡 Ensure the database user has proper permissions');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 Fix: DNS resolution error - check your cluster URL');
      console.log('💡 Verify your MongoDB Atlas cluster is running');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Fix: Network timeout - check your internet connection');
      console.log('💡 Verify IP whitelist includes 0.0.0.0/0 or your current IP');
    } else if (error.message.includes('SSL') || error.message.includes('handshake')) {
      console.log('💡 Fix: SSL/TLS handshake error - try adding ssl=true to URI');
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting MongoDB connection tests...\n');
  
  let successfulConnection = false;
  
  for (const test of testConnections) {
    const result = await testConnection(test.name, test.uri);
    if (result) {
      successfulConnection = true;
      break;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (successfulConnection) {
    console.log('🎉 SUCCESS: At least one MongoDB connection works!');
    console.log('✅ Your application should be able to connect to MongoDB');
  } else {
    console.log('❌ FAILURE: No MongoDB connections successful');
    console.log('🔧 Please check your configuration and try again');
  }
  console.log('='.repeat(50));
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  mongoose.disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Promise Rejection:', err.message);
  mongoose.disconnect();
  process.exit(1);
});

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test script error:', error);
  process.exit(1);
});
