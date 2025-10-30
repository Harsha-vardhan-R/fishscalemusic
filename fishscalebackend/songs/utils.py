from pymongo import MongoClient
from sklearn.preprocessing import normalize
import numpy as np
import pickle
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client['fishscale']
collection = db['songs']

with open(BASE_DIR / 'fishscalebackend' / 'data' / 'chord_vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

def search_songs(query_chords, top_n=25):
    query_str = ' '.join(query_chords)
    query_vec = vectorizer.transform([query_str])
    query_vec_norm = normalize(query_vec, norm='l2').toarray()[0]
    query_set = set(query_chords)

    # Pull all songs (for simplicity; for large DB use $in filter on chords)
    all_songs = list(collection.find({}, {'_id': 0}))
    results = []
    for song in all_songs:
        song_chords = set(song['chords'])
        if len(query_set.intersection(song_chords)) >= 2:
            score = np.dot(query_vec_norm, np.array(song['chord_vector']))
            results.append({
                'song_name': song['song_name'],
                'artists': song['artists'],
                'chords': song['chords'],
                'similarity': float(score),
                'matches': len(query_set.intersection(song_chords)),
                'artist_popularity': song['artist_popularity'],
                'song_popularity': song['song_popularity']
            })
    results.sort(
        key=lambda x: (x['similarity'], x['artist_popularity'], x['song_popularity']),
        reverse=True)
    return results[:top_n]
