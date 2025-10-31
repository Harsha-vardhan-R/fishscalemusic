import pandas as pd
from pymongo import MongoClient
import os

MONGO_URI = f"mongodb+srv://rharshavardhan2004_db_user:{os.getenv('DATABASE_PASSWORD')}@fichsalecluster.2chz2wu.mongodb.net/?appName=FichSaleCluster"
client = MongoClient(MONGO_URI)
db = client['fishscale']
songs_collection = db['songs']

df = pd.read_pickle('./data/songs_with_vectors.pkl')

songs_collection.delete_many({})

print("Inserting songs into Atlas...")

batch_size = 1000
batch = []

for idx, row in df.iterrows():
    doc = {
        'song_name': row['song_name'],
        'artists': row['artists'],
        'chords': row['chords'],
        'chord_vector': row['chord_vector'].tolist(),
        'artist_popularity': int(row['artist_popularity']),
        'song_popularity': int(row['song_popularity'])
    }
    batch.append(doc)

    if (idx + 1) % batch_size == 0:
        songs_collection.insert_many(batch)
        print(f"Inserted {idx + 1} songs")
        batch = []

if batch:
    songs_collection.insert_many(batch)
    print(f"Inserted {len(df)} songs total")

print(f"Done! Total: {songs_collection.count_documents({})}")

songs_collection.create_index([('artist_popularity', -1)])
songs_collection.create_index([('song_popularity', -1)])
