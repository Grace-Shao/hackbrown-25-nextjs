import os
import joblib
import pandas as pd
from sklearn.neighbors import NearestNeighbors


def model_fn(model_dir):
    """Load model components from the model directory."""
    knn = joblib.load(os.path.join(model_dir, "knn_model.pkl"))
    scaler = joblib.load(os.path.join(model_dir, "scaler.pkl"))
    label_encoder = joblib.load(os.path.join(model_dir, "label_encoder.pkl"))
    return knn, scaler, label_encoder


def predict_fn(input_data, model):
    """Generate predictions."""
    knn, scaler, label_encoder = model

    # Assume input_data is a dictionary containing feature values
    input_df = pd.DataFrame([input_data])

    # Scale and transform input data
    scaled_input = scaler.transform(input_df)

    # Find nearest neighbors
    distances, indices = knn.kneighbors(scaled_input)

    return {"nearest_neighbors_indices": indices.tolist()}
