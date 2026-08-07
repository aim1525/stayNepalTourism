import random
import math

def generate_synthetic_interactions(num_users=100, num_homestays=30, num_interactions=520, seed=42):
    """
    Pure Python synthetic interaction generator (520 rows) for Nepal homestay recommendations.
    """
    random.seed(seed)
    cultural_groups = ['Gurung', 'Sherpa', 'Tharu', 'Newari', 'Thakali', 'Kirat', 'Tamang']
    districts = ['Kaski', 'Solukhumbu', 'Chitwan', 'Bhaktapur', 'Mustang', 'Ilam', 'Rasuwa', 'Palpa']

    homestays = []
    for h_id in range(1, num_homestays + 1):
        c_tag = random.choice(cultural_groups)
        dist = random.choice(districts)
        price = random.choice([1500, 1800, 2000, 2400, 2800])
        homestays.append({
            'homestay_id': h_id,
            'title': f'Nepal Rural Homestay {h_id}',
            'district': dist,
            'cultural_tag': c_tag,
            'price_per_night': price,
            'features': f'{c_tag} cultural dance organic food mountain view'
        })

    users = []
    for u_id in range(1, num_users + 1):
        users.append({
            'user_id': u_id,
            'preferred_culture': random.choice(cultural_groups),
            'budget_category': random.choice(['budget', 'mid', 'luxury'])
        })

    interactions = []
    seen = set()
    while len(interactions) < num_interactions:
        u = random.choice(users)
        h = random.choice(homestays)
        pair = (u['user_id'], h['homestay_id'])
        if pair in seen:
            continue
        seen.add(pair)

        base = random.choice([3, 4, 5])
        if u['preferred_culture'] == h['cultural_tag']:
            rating = min(5, base + 1)
        else:
            rating = base

        interactions.append({
            'user_id': u['user_id'],
            'homestay_id': h['homestay_id'],
            'rating': rating,
            'timestamp': 1700000000 + random.randint(0, 1000000)
        })

    return interactions, homestays, users

if __name__ == '__main__':
    ints, homes, users = generate_synthetic_interactions()
    print(f"Pure Python dataset generated: {len(ints)} interactions across {len(homes)} homestays and {len(users)} users.")
