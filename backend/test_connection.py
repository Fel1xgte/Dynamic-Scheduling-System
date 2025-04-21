from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME', 'dynamic_scheduling')

def test_connection():
    try:
        # Create MongoDB client
        client = MongoClient(MONGO_URI)
        
        # Test connection by accessing the database
        db = client[DB_NAME]
        
        # List all collections
        collections = db.list_collection_names()
        print(f"Successfully connected to MongoDB!")
        print(f"Database: {DB_NAME}")
        print(f"Collections: {collections}")
        
        # Close the connection
        client.close()
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_connection() 