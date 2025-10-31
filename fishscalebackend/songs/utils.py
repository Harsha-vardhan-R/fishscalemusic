from pymongo import MongoClient
from sklearn.preprocessing import normalize
import numpy as np
import pickle
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
MONGO_URI = f"mongodb+srv://rharshavardhan2004_db_user:{os.getenv('DATABASE_PASSWORD')}@fichsalecluster.2chz2wu.mongodb.net/?appName=FichSaleCluster"
client = MongoClient(MONGO_URI)
db = client['fishscale']
collection = db['songs']

with open(BASE_DIR / 'fishscalebackend' / 'data' / 'chord_vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

def search_songs(query_chords, top_n=15, num_candidates=200):
    query_str = ' '.join(query_chords)
    query_vec = vectorizer.transform([query_str])
    query_vec_norm = normalize(query_vec, norm='l2').toarray()[0].tolist()

    pipeline = [
        {
            '$vectorSearch': {
                'index': 'vector_index',
                'path': 'chord_vector',
                'queryVector': query_vec_norm,
                'numCandidates': num_candidates,
                'limit': top_n
            }
        },
        {
            '$set': {
                'overlap_count': {
                    '$size': {
                        '$setIntersection': ['$chords', query_chords]
                    }
                }
            }
        },
        {
            '$sort': {
                'overlap_count': -1,
                'similarity': -1
            }
        },
        {
            '$project': {
                '_id': 0,
                'song_name': 1,
                'artists': 1,
                'chords': 1,
                'similarity': {'$meta': 'vectorSearchScore'},
                'artist_popularity': 1,
                'song_popularity': 1,
                'overlap_count': 1
            }
        }
    ]

    results = list(collection.aggregate(pipeline))
    return results
