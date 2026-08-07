import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from data_generator import generate_synthetic_interactions
from models.cbf import ContentBasedFiltering
from models.ubcf import UserBasedCollaborativeFiltering
from models.ncf import NeuralCollaborativeFiltering
from evaluator import evaluate_models

# Initialize Models
interactions, homestays, users = generate_synthetic_interactions()

cbf_model = ContentBasedFiltering()
cbf_model.fit(homestays)

ubcf_model = UserBasedCollaborativeFiltering(metric='jm_distance')
ubcf_model.fit(interactions, homestays)

ncf_model = NeuralCollaborativeFiltering()
ncf_model.fit(interactions, homestays)

class RecommendationAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if path == '/health':
            res = {
                "status": "online",
                "service": "StayNepal AI Recommendation Microservice",
                "models_loaded": ["CBF", "UBCF", "NCF"],
                "dataset_rows": len(interactions)
            }
        elif path == '/recommend':
            start_time = time.time()
            user_id = int(query_params.get('user_id', [1])[0])
            model = query_params.get('model', ['ncf'])[0].lower()
            top_n = int(query_params.get('top_n', [5])[0])

            if model == 'cbf':
                recs = cbf_model.predict_recommendations("Gurung Sherpa mountain view", top_n=top_n)
            elif model == 'ubcf':
                recs = ubcf_model.predict_recommendations(user_id=user_id, top_n=top_n)
            else:
                recs = ncf_model.predict_recommendations(user_id=user_id, top_n=top_n)

            latency = round((time.time() - start_time) * 1000, 2)
            res = {
                "user_id": user_id,
                "selected_model": model.upper(),
                "execution_time_ms": latency,
                "total_recommendations": len(recs),
                "recommendations": recs
            }
        elif path == '/evaluate':
            metrics = evaluate_models(k_folds=5, top_k=10)
            res = {
                "evaluation_method": "5-Fold Cross Validation",
                "dataset_size": len(interactions),
                "metrics": metrics
            }
        else:
            res = {"error": f"Path '{path}' not found"}

        self.wfile.write(json.dumps(res, indent=2).encode('utf-8'))

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RecommendationAPIHandler)
    print(f"StayNepal Python AI Microservice running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
