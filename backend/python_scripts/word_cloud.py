import sys

import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords

import matplotlib.pyplot as plt
from wordcloud import WordCloud
import os
import base64


def main():
    os.system("python3 -m pip install -r requirements.txt")
    text = sys.argv[1]
    tokens = nltk.word_tokenize(text)
    token_words = [w for w in tokens if w.isalpha()]

    # removing empty strings and stop words
    stop_words = set(stopwords.words('english'))
    meaningful_words = [w for w in token_words if not w in stop_words]

    d = list(dict.fromkeys(meaningful_words))

    # processed text
    joined_words = (" ".join(d))

    wordcloud = WordCloud(width=800, height=800,
                          background_color='white',
                          stopwords=[],
                          min_font_size=10).generate(joined_words)

    file_name = "word_cloud.jpg"
    wordcloud.to_file(file_name)
    with open(file_name, 'rb') as img:
        data = base64.b64encode(img.read())
    os.remove(file_name)

    print(data)

    # Start process
if __name__ == '__main__':
    main()
