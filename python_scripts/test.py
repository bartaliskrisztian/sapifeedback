import sys
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud
# import nltk
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize

import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(
    cred, {'databaseURL': 'https://feedback-303412-default-rtdb.europe-west1.firebasedatabase.app'})

topicId = '-MWAticx7rswCbzCw83f'
userId = '109667866503022608518'
ref = db.reference("reports/" + topicId)


def main():
    comment_words = ''
    data = ref.get()
    for key in data:
        text = str(data[key]['text'])
        tokens = text.split()

        for i in range(len(tokens)):
            tokens[i] = tokens[i].lower()

        comment_words += " ".join(tokens)+" "

    wordcloud = WordCloud(width=800, height=800,
                          background_color='white',
                          stopwords=[],
                          min_font_size=10).generate(comment_words)

    wordcloud = wordcloud.to_file("cloud.png")

    # plt.figure(figsize=(8, 8), facecolor=None)
    # plt.imshow(wordcloud)
    # plt.axis("off")
    # plt.tight_layout(pad=0)

    # plt.show()


# Start process
if __name__ == '__main__':
    main()
