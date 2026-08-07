from data_generator import generate_synthetic_interactions
from models.cbf import ContentBasedFiltering
from models.ubcf import UserBasedCollaborativeFiltering, jeffries_matusita_similarity
from models.ncf import NeuralCollaborativeFiltering
from evaluator import evaluate_models

def test_dataset_generation():
    df_int, df_home, df_users = generate_synthetic_interactions(num_interactions=520)
    assert len(df_int) >= 500
    assert len(df_home) == 30
    assert len(df_users) == 100

def test_jeffries_matusita_similarity():
    vec1 = [5, 4, 3, 0, 1]
    vec2 = [5, 4, 3, 1, 0]
    sim = jeffries_matusita_similarity(vec1, vec2)
    assert 0.0 <= sim <= 1.0
    assert sim > 0.8 # High similarity for near-identical rating vectors

def test_cbf_recommendation():
    df_int, df_home, _ = generate_synthetic_interactions()
    cbf = ContentBasedFiltering()
    cbf.fit(df_home)
    recs = cbf.predict_recommendations("Gurung cultural meal", top_n=5)
    assert len(recs) == 5
    assert 'score' in recs[0]

def test_ubcf_recommendation():
    df_int, df_home, _ = generate_synthetic_interactions()
    ubcf = UserBasedCollaborativeFiltering(metric='jm_distance')
    ubcf.fit(df_int, df_home)
    recs = ubcf.predict_recommendations(user_id=1, top_n=5)
    assert len(recs) == 5
    assert 'score' in recs[0]

def test_ncf_recommendation():
    df_int, df_home, _ = generate_synthetic_interactions()
    ncf = NeuralCollaborativeFiltering()
    ncf.fit(df_int, df_home, epochs=2)
    recs = ncf.predict_recommendations(user_id=1, top_n=5)
    assert len(recs) == 5
    assert 'score' in recs[0]

def test_evaluation_summary():
    metrics = evaluate_models(k_folds=2, top_k=10)
    assert len(metrics) == 3 # CBF, UBCF, NCF
    for m in metrics:
        assert 'precision_at_10' in m
        assert 'recall_at_10' in m
        assert 'f1_score' in m
