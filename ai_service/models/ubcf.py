import math

def jeffries_matusita_similarity(vec1, vec2):
    """
    Computes Jeffries-Matusita (JM) distance similarity in pure Python
    based on Wang, X. (2023).
    """
    sum1 = sum(vec1) + 1e-9
    sum2 = sum(vec2) + 1e-9
    p = [x / sum1 for x in vec1]
    q = [x / sum2 for x in vec2]

    # Bhattacharyya Coefficient
    bc = sum(math.sqrt(p_i * q_i) for p_i, q_i in zip(p, q))
    
    # JM Distance: J = sqrt(2 * (1 - BC))
    jm_dist = math.sqrt(max(0.0, 2.0 * (1.0 - bc)))
    
    # Convert distance to similarity
    similarity = 1.0 - (jm_dist / math.sqrt(2.0))
    return max(0.0, min(1.0, similarity))

class UserBasedCollaborativeFiltering:
    def __init__(self, metric='jm_distance'):
        self.metric = metric
        self.user_ratings = {}
        self.all_homestay_ids = []
        self.homestays = []

    def fit(self, interactions, homestays):
        self.homestays = homestays
        self.all_homestay_ids = sorted(list({h['homestay_id'] for h in homestays}))
        
        self.user_ratings = {}
        for inter in interactions:
            u_id = inter['user_id']
            h_id = inter['homestay_id']
            rating = inter['rating']
            if u_id not in self.user_ratings:
                self.user_ratings[u_id] = {hid: 0 for hid in self.all_homestay_ids}
            self.user_ratings[u_id][h_id] = rating

    def predict_recommendations(self, target_user_id, top_n=5):
        if target_user_id in self.user_ratings:
            target_vec = [self.user_ratings[target_user_id][hid] for hid in self.all_homestay_ids]
        else:
            # Average profile
            target_vec = [3.5 for _ in self.all_homestay_ids]

        similarities = []
        for u_id, r_dict in self.user_ratings.items():
            if u_id == target_user_id:
                continue
            u_vec = [r_dict[hid] for hid in self.all_homestay_ids]
            sim = jeffries_matusita_similarity(target_vec, u_vec)
            similarities.append((u_id, sim))

        similarities.sort(key=lambda x: x[1], reverse=True)
        top_similar_users = similarities[:10]

        scores = {hid: 0.0 for hid in self.all_homestay_ids}
        total_sim = sum(sim for _, sim in top_similar_users) + 1e-9

        for u_id, sim in top_similar_users:
            for hid in self.all_homestay_ids:
                scores[hid] += sim * self.user_ratings[u_id][hid]

        results = []
        for h in self.homestays:
            hid = h['homestay_id']
            final_score = scores[hid] / total_sim
            item = dict(h)
            item['score'] = round(min(5.0, final_score), 4)
            results.append(item)

        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_n]
