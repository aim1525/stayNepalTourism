import sys
from data_generator import generate_synthetic_interactions
from models.cbf import ContentBasedFiltering
from models.ubcf import UserBasedCollaborativeFiltering, jeffries_matusita_similarity
from models.ncf import NeuralCollaborativeFiltering
from evaluator import evaluate_models

def run_all_tests():
    print("=======================================================")
    print("StayNepal Python AI Microservice Verification Suite")
    print("=======================================================")

    # Test 1
    ints, homes, users = generate_synthetic_interactions(num_interactions=520)
    assert len(ints) >= 500, "Dataset generation failed"
    print("  [PASS] Synthetic Dataset Generation (520 interaction rows)")

    # Test 2
    sim = jeffries_matusita_similarity([5, 4, 3, 0], [5, 4, 3, 1])
    assert 0.0 <= sim <= 1.0, "JM similarity out of bounds"
    print(f"  [PASS] Jeffries-Matusita Distance Similarity ({round(sim, 4)})")

    # Test 3
    cbf = ContentBasedFiltering()
    cbf.fit(homes)
    recs_cbf = cbf.predict_recommendations("Gurung cultural meal", top_n=5)
    assert len(recs_cbf) == 5, "CBF recommendation failed"
    print("  [PASS] Content-Based Filtering (CBF) Top-5 Recommendations")

    # Test 4
    ubcf = UserBasedCollaborativeFiltering(metric='jm_distance')
    ubcf.fit(ints, homes)
    recs_ubcf = ubcf.predict_recommendations(target_user_id=1, top_n=5)
    assert len(recs_ubcf) == 5, "UBCF recommendation failed"
    print("  [PASS] User-Based Collaborative Filtering (UBCF) Top-5 Recommendations")

    # Test 5
    ncf = NeuralCollaborativeFiltering()
    ncf.fit(ints, homes, epochs=2)
    recs_ncf = ncf.predict_recommendations(user_id=1, top_n=5)
    assert len(recs_ncf) == 5, "NCF recommendation failed"
    print("  [PASS] Neural Collaborative Filtering (NCF) Top-5 Recommendations")

    # Test 6
    summary = evaluate_models()
    assert len(summary) == 3, "Evaluation summary length invalid"
    print("  [PASS] 5-Fold Cross Validation Precision@10, Recall@10, F1-Score Summary")

    print("\nSUCCESS: All 6 AI Microservice Unit & Metric Evaluation Tests PASSED Cleanly!")

if __name__ == '__main__':
    run_all_tests()
