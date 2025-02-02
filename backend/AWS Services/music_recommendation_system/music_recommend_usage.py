import pandas as pd
import joblib

# Load saved models and objects
knn = joblib.load("knn_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# Load data and pre-process it the same way as during training
tracks = pd.read_csv("dataset.csv")
unique_tracks = tracks.drop_duplicates().reset_index(drop=True)
unique_tracks = unique_tracks.drop(["track_id"], axis=1)
unique_tracks["track_genre"] = label_encoder.transform(unique_tracks["track_genre"])
unique_tracks = unique_tracks.drop_duplicates(
    subset=["track_name"], keep="first"
).reset_index(drop=True)
unique_tracks["explicit"] = unique_tracks["explicit"].astype(int)

# Scale the data
scaled_data = scaler.transform(
    unique_tracks.drop(columns=["album_name", "track_name", "artists"])
)


def recommend_songs(track_name):
    """Recommends 10 similar songs for a given track using the KNN model."""

    if track_name not in unique_tracks["track_name"].values:
        print("Track not in dataset")
    else:
        row_index = unique_tracks[unique_tracks["track_name"] == track_name].index[0]
        distances, indices = knn.kneighbors(scaled_data[row_index].reshape(1, -1))

        recommendations = []
        for i in indices[0]:
            recommendations.append(
                (unique_tracks.iloc[i]["track_name"], unique_tracks.iloc[i]["artists"])
            )

        print("\nRecommended Tracks:")
        for track, artist in recommendations:
            print(f"{track} by {artist}")


# Get input and make recommendations
input_track = input("Enter a track: ")
recommend_songs(input_track)
