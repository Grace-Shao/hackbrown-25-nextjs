## Let’s be real

In the world of social media, everyone’s out here trying to stay fresh, cool, and relevant. You want to feel “normal” (whatever that means these days), right? That’s why nobody’s messing around with weird, offbeat music tracks that make your post feel awkward. Platforms like TikTok and Instagram are driving the trend game hard, and creators know it. Catchy pop beats, vibey hip-hop, and those feel-good tracks that everyone’s humming? That’s what’s popping. When your content’s on-trend, you’re not just posting—you’re connecting with your audience in a way that hits just right. 

## What In2ne Does

In2ne is designed with two modes to serve both everyday users and content creators. In the first mode, normal users can upload a picture of themselves, which is processed using AWS Rekognition technology to label elements within the image. We then use OpenAI to transcribe these labels into a creative story. This story is analyzed by an agent that assigns matching audio features. To quickly recommend the most relevant audio tracks, we leverage a vector database powered by Pinecone. Additionally, a custom machine learning model utilizing a k-cluster algorithm helps recommend similar songs based on the user’s music preferences.

For content creators, In2ne taps into agency power through a multi-agent system. It first classifies their uploaded image and then calls on a trend analyzer agent. This agent scans platforms like TikTok, YouTube, and Tavily via APIs to scrape data on the most viral music based on metrics such as likes, views, comments, and shares. In2ne suggests a track that aligns with the content creator’s image, enabling them to stay relevant and trendy in the fast-paced world of social media.

## How We Built In2ne

The frontend of In2ne is built with Next.js, Tailwind CSS, and TypeScript, ensuring a sleek and responsive user experience. On the backend, we implemented Flask and Python, supported by AgencySwarm and OpenAI integrations. 
**AWS services** play a key role, with Rekognition handling image classification, Amplify Hosting managing deployment, DynamoDB providing efficient data searching, SageMaker powering machine learning models, and Polly generating text-to-speech functionality.

## Challenges We Faced

Initially, we intended to fetch audio data from Spotify; however, due to recent machine learning trends, Spotify deprecated their API for audio features, forcing us to find alternative data sources. Another major challenge was deploying the project on AWS across two different stacks, which created significant hurdles with CORS configuration to enable proper communication between the frontend and backend services.

## What We Learned

So here’s the thing—we thought music was all about genres, right? Nope. Turns out, there’s a whole bunch of stuff that makes a track tick:

- **Danceability** (yeah, that’s a word)  
- Explicitness  
- Loudness  
- Speechiness  
- Acousticness  
- Instrumentalness  
- Liveness  
- Valence  
- Tempo  
- Energy  

Honestly, who comes up with these terms? And seriously, danceability—how do they even figure (measure) that out?

## What’s Next

Next up, we’re looking to team up with Instagram to make the music game even stronger. Instead of just pushing whatever’s globally trending, we’re talking about music that vibes with what’s actually happening in your life. Like, nobody wants to fail a calculus III exam and then get hit with “Last Friday Night”—that’s just a fast track to a sad spiral. We’re aiming to serve tracks that *get you,* keeping your feed relatable and your MOOD on point.
