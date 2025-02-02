from TikTokApi import TikTokApi
from dotenv import load_dotenv
import pandas as pd
import os

# Load environment variables from .env file
load_dotenv()

# If you had an API key, you would access it like this:
# api_key = os.getenv("TIKTOK_API_KEY")

def get_trending_music_data(count=10):
    # Initialize the TikTok API
    api = TikTokApi()

    # Fetch trending TikTok videos
    trending_videos = api.trending(count=count)

    # Collect trending music data
    music_data = []

    for video in trending_videos:
        music_info = video.get('music', {})
        music_title = music_info.get('title', 'Unknown')
        author = music_info.get('authorName', 'Unknown')
        play_url = music_info.get('playUrl', '')

        # Get likes, comments, and shares for the video
        likes = video.get('stats', {}).get('diggCount', 0)
        comments = video.get('stats', {}).get('commentCount', 0)
        shares = video.get('stats', {}).get('shareCount', 0)

        music_data.append({
            'Music Title': music_title,
            'Author': author,
            'Play URL': play_url,
            'Likes': likes,
            'Comments': comments,
            'Shares': shares
        })

    # Convert to DataFrame and sort by likes, comments, and shares
    df = pd.DataFrame(music_data)
    df = df.sort_values(by=['Likes', 'Comments', 'Shares'], ascending=False)

    return df

# Get the trending music data
music_df = get_trending_music_data()

# Display the results
print(music_df)

# Optionally save to CSV
music_df.to_csv('trending_music.csv', index=False)
