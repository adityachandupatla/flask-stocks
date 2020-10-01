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

def append_endpoints(success_response, current_ticker):
    success_response["endpoints"] = {}
    success_response["endpoints"]["outlook"] = "/stock/api/v1.0/outlook/" + current_ticker
    success_response["endpoints"]["summary"] = "/stock/api/v1.0/summary/" + current_ticker
    success_response["endpoints"]["charts"] = "/stock/api/v1.0/chart/" + current_ticker
    success_response["endpoints"]["news"] = "/stock/api/v1.0/news/" + current_ticker
    return success_response

def is_valid_ticker(ticker):
    return (ticker != None) and (ticker != "") and ticker.isalnum()

def return_news_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "No news articles have been found"}), 500)

def parse_outlook_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "Unable to parse the company outlook response from Tiingo"}), 500)

def parse_stock_summary_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "Unable to parse the stock summary response from Tiingo"}), 500)

def parse_chart_values_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "Unable to parse the chart values response from Tiingo"}), 500)

def parse_news_error():
    # Treating this case as: Internal server error
    return make_response(jsonify({"message": "Unable to parse the news response from News API"}), 500)