import math
import random

class NeuralCollaborativeFiltering:
    """
    Pure Python implementation of Neural Collaborative Filtering (NCF).
    """
    def __init__(self, embedding_dim=8):
        self.embedding_dim = embedding_dim
        self.user_embeddings = {}
        self.item_embeddings = {}
        self.homestays = []

    def fit(self, interactions, homestays, epochs=5):
        self.homestays = homestays
        random.seed(42)
        
        user_ids = {i['user_id'] for i in interactions}
        item_ids = {h['homestay_id'] for h in homestays}

        for u in user_ids:
            self.user_embeddings[u] = [random.uniform(-0.1, 0.1) for _ in range(self.embedding_dim)]
        for item_id in item_ids:
            self.item_embeddings[item_id] = [random.uniform(-0.1, 0.1) for _ in range(self.embedding_dim)]

        for _ in range(epochs):
            for inter in interactions:
                u_id = inter['user_id']
                item_id = inter['homestay_id']
                target = (inter['rating'] - 1.0) / 4.0

                u_emb = self.user_embeddings.get(u_id, [0.0] * self.embedding_dim)
                i_emb = self.item_embeddings.get(item_id, [0.0] * self.embedding_dim)

                dot = sum(u * i for u, i in zip(u_emb, i_emb))
                pred = 1.0 / (1.0 + math.exp(-max(-10.0, min(10.0, dot))))
                err = target - pred

                for d in range(self.embedding_dim):
                    self.user_embeddings[u_id][d] += 0.05 * err * i_emb[d]
                    self.item_embeddings[item_id][d] += 0.05 * err * u_emb[d]

    def predict_recommendations(self, user_id, top_n=5):
        u_emb = self.user_embeddings.get(user_id, [0.05] * self.embedding_dim)
        
        results = []
        for h in self.homestays:
            item_id = h['homestay_id']
            i_emb = self.item_embeddings.get(item_id, [0.05] * self.embedding_dim)
            dot = sum(u * i for u, i in zip(u_emb, i_emb))
            score = 1.0 / (1.0 + math.exp(-max(-10.0, min(10.0, dot))))
            
            item = dict(h)
            item['score'] = round(0.5 + score * 0.5, 4)
            results.append(item)

        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_n]
