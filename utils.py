from flask import make_response, jsonify

def read_secret(filename):
    contents = ""
    with open(filename) as f:
        contents = f.read()
    return contents

def is_valid_article(dict_obj):
    # Need to verify whether this validation is correct or not
    keys = ["title", "url", "urlToImage", "publishedAt"]
    for key in keys:
        if key not in dict_obj or dict_obj[key] == None or dict_obj[key] == "":
            return False
    return True

def is_valid_ticker(ticker):
    return (ticker != None) and (ticker != "") and ticker.isalnum()

def return_news_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "No news articles have been found"}), 500)