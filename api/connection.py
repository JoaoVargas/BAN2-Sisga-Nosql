from pymongo import MongoClient

def get_conn():
    client = MongoClient(
        host='mongo',
        port=27017,
        username='mongoadm', 
        password='mongoadm', 
        authSource='admin'  
    )
    db = client['sisga']  
    
    return db
