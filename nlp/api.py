from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import nltk
import re
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)
CORS(app)

# Download NLTK data once
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize preprocessing tools
tokenizer = RegexpTokenizer(r'\w+')
en_stopwords = set(stopwords.words('english'))
wnet = WordNetLemmatizer()

# Load and preprocess the dataset once
df = pd.read_csv("train.csv", encoding='latin1')
le = LabelEncoder()
X_train = list(df["text"])[:10000]
df_encoded = df.apply(le.fit_transform, axis=0)
dff = df_encoded.values
y_train = list(dff[:10000, 3])
y_train = [1 if y == 2 else y for y in y_train]

def getcleantext(text):
    text = str(text).lower()
    tokens = tokenizer.tokenize(text)
    new_tokens = [i for i in tokens if i not in en_stopwords]
    lemmatized_tokens = [wnet.lemmatize(i) for i in new_tokens]
    clean_text = " ".join(lemmatized_tokens)
    return clean_text

# Preprocess training dataset
X_clean = [getcleantext(i) for i in X_train]

# Vectorization
cv = CountVectorizer(ngram_range=(1, 2))
X_vec = cv.fit_transform(X_clean).toarray()

# Train the model once
mn = MultinomialNB()
mn.fit(X_vec, y_train)

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.json
        if 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        Xt_clean = [getcleantext(text)]
        Xt_vec = cv.transform(Xt_clean).toarray()
        y_pred = mn.predict(Xt_vec)
        result = int(y_pred[0])  # Convert numpy int64 to Python int
        return jsonify({'sentiment': result})
    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({'sentiment': '1'}), 400

if __name__ == '__main__':
    app.run(debug=True)
