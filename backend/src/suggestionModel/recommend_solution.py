import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

tracks = pd.read_csv('dataset.csv')
cat_col = [col for col in tracks.columns if tracks[col].dtype == 'object']
num_col = [col for col in tracks.columns if tracks[col].dtype != 'object']

unique_tracks = tracks.drop_duplicates().reset_index(drop=True)
duplicates = unique_tracks['track_id'].duplicated()
unique_tracks = unique_tracks.drop(['track_id'], axis = 1)
unique_genres = unique_tracks["track_genre"].unique()
label_encoder = LabelEncoder()
unique_tracks['track_genre'] = label_encoder.fit_transform(unique_tracks['track_genre'])
unique_tracks["track_genre"].unique()
non_unique_rows = unique_tracks[unique_tracks.duplicated(keep=False)]
unique_tracks = unique_tracks.drop_duplicates(subset=['track_name'], keep='first').reset_index(drop=True)
non_unique_rows = unique_tracks[unique_tracks.duplicated(keep=False)]
unique_tracks['explicit'] = unique_tracks['explicit'].astype(int)

def scale_columns():
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(unique_tracks.drop(columns=['album_name', 'track_name', 'artists']))
    scaled_df = pd.DataFrame(scaled_data, columns=unique_tracks.columns.drop(['album_name', 'track_name', 'artists']))

    scaled_df.head()
    scaled_df.shape
    return scaled_df
    

def setup_knn(scaled_df):
    '''Initializes the K-Nearest Neighbors model and fits it on the given scaled dataframe.'''
    
    # TODO: create the model, letting k = 10 and the distance formula be 'euclidean'. Then, fit it to the data
    knn = NearestNeighbors(n_neighbors=10, metric='euclidean')
    knn.fit(scaled_df)
    return knn

def recommend_songs(track, knn, scaled_data):
    '''Given an input track, checks if the track is in the dataset. If so, it retrieves the row number of its first
    appearance and uses the K-Nearest Neighbors model to find the 10 nearest neighbors. Then, it prints the 10 tracks
    and corresponding artists.'''
    

    if track not in unique_tracks['track_name'].values:
        print("Track not in dataset")
    else:
        # TODO: find the index of the track in the dataframe, then find the indices of the 10 closest tracks
        row_index = unique_tracks[unique_tracks['track_name'] == track].index[0]
        unique_tracks.iloc[row_index]
        
        distances, indices = knn.kneighbors(scaled_data.iloc[row_index].values.reshape(1, -1))

        ret_tracks = []

        for i in indices:
            ret_tracks.append((unique_tracks.iloc[i]['track_name'], unique_tracks.iloc[i]['artists']))
        print(ret_tracks)

scaled_data = scale_columns()
knn = setup_knn(scaled_data)
input_track = input("Enter a track: ")
recommend_songs(input_track, knn, scaled_data)