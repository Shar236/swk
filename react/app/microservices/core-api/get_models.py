import google.generativeai as genai
genai.configure(api_key='AIzaSyAd5LBSi28Z4cB-4dPX_b7BbG8kf2mkJIU')
with open('exact_models.txt', 'w') as f:
    for m in genai.list_models():
        f.write(f"{m.name}\n")
