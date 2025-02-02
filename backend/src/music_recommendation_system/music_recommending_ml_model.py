import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import NearestNeighbors
import joblib  # For saving and loading models

# Load and process data
tracks = pd.read_csv('dataset.csv')
cat_col = [col for col in tracks.columns if tracks[col].dtype == 'object']
num_col = [col for col in tracks.columns if tracks[col].dtype != 'object']

unique_tracks = tracks.drop_duplicates().reset_index(drop=True)
unique_tracks = unique_tracks.drop(['track_id'], axis=1)
label_encoder = LabelEncoder()
unique_tracks['track_genre'] = label_encoder.fit_transform(unique_tracks['track_genre'])
unique_tracks = unique_tracks.drop_duplicates(subset=['track_name'], keep='first').reset_index(drop=True)
unique_tracks['explicit'] = unique_tracks['explicit'].astype(int)

# Scale columns
scaler = StandardScaler()
scaled_data = scaler.fit_transform(unique_tracks.drop(columns=['album_name', 'track_name', 'artists']))

# Fit KNN model
knn = NearestNeighbors(n_neighbors=10, metric='euclidean')
knn.fit(scaled_data)

# Save the model and preprocessing objects
joblib.dump(knn, 'knn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')

print("Model and pre-processing objects saved successfully.")
