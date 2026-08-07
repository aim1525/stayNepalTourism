import math
from collections import Counter

def compute_cosine_similarity(vec1, vec2):
    dot_product = sum(vec1.get(term, 0) * vec2.get(term, 0) for term in set(vec1) | set(vec2))
    mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
    mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

class ContentBasedFiltering:
    def __init__(self):
        self.homestays = []
        self.doc_vectors = []

    def fit(self, homestays):
        self.homestays = homestays
        self.doc_vectors = []
        for h in homestays:
            text = f"{h.get('district', '')} {h.get('cultural_tag', '')} {h.get('title', '')} {h.get('features', '')}".lower()
            words = text.split()
            tf = Counter(words)
            self.doc_vectors.append(tf)

    def predict_recommendations(self, user_query, top_n=5):
        query_words = user_query.lower().split()
        query_vec = Counter(query_words)

        scored = []
        for idx, doc_vec in enumerate(self.doc_vectors):
            sim = compute_cosine_similarity(query_vec, doc_vec)
            item = dict(self.homestays[idx])
            item['score'] = round(sim, 4)
            scored.append(item)

        scored.sort(key=lambda x: x['score'], reverse=True)
        return scored[:top_n]
