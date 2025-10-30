import pandas as pd
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client['fishscale']
songs_collection = db['songs']

df = pd.read_pickle('./data/songs_with_vectors.pkl')

songs_collection.delete_many({})

for idx, row in df.iterrows():
    doc = {
        'song_name': row['song_name'],
        'artists': row['artists'],
        'chords': row['chords'],
        'chord_vector': row['chord_vector'].tolist(),
        'artist_popularity': int(row['artist_popularity']),
        'song_popularity': int(row['song_popularity'])
    }
    songs_collection.insert_one(doc)

print(f"Inserted {songs_collection.count_documents({})} songs!")
