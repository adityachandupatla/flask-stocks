from flask import Flask, jsonify, abort, make_response
from dateutil.relativedelta import relativedelta

import datetime
import requests

import utils
import parser

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

api_tiingo_token = utils.read_secret(".api_tiingo")
news_api_token = utils.read_secret(".news_api")
app_error_msg = "Error : No record has been found, please enter a valid symbol."

@app.errorhandler(404)
def invalid(error):
    return make_response(jsonify({"message": app_error_msg}), 404)

@app.route("/stock/api/v1.0/outlook/<ticker>", methods=["GET"])
def company_outlook(ticker):
    if not utils.is_valid_ticker(ticker):
        return abort(404)
    meta_endpoint_api = "https://api.tiingo.com/tiingo/daily/" + ticker
    query_params = {"token": api_tiingo_token}
    response = requests.get(meta_endpoint_api, params=query_params)
    if response.status_code == requests.codes.ok:
        return parser.parse_company_outlook(response.json())
    else:
        return abort(404)

@app.route("/stock/api/v1.0/summary/<ticker>", methods=["GET"])
def stock_summary(ticker):
    if not utils.is_valid_ticker(ticker):
        return abort(404)
    top_of_book_api = "https://api.tiingo.com/iex/" + ticker
    query_params = {"token": api_tiingo_token}
    response = requests.get(top_of_book_api, params=query_params)
    if response.status_code == requests.codes.ok:
        return parser.parse_stock_summary(response.json()[0])
    else:
        return abort(404)


@app.route("/stock/api/v1.0/chart/<ticker>", methods=["GET"])
def chart(ticker):
    if not utils.is_valid_ticker(ticker):
        return abort(404)
    historical_endpoint_api = "https://api.tiingo.com/iex/" + ticker + "/prices"
    six_month_prior_date = str(datetime.date.today() - relativedelta(months=6))
    query_params = {
        "startDate": six_month_prior_date,
        "resampleFreq": "12hour", # Need to check whether this is fixed
        "columns": "open,high,low,close,volume", # why do you need other columns if you are not passing to UI?
        "token": api_tiingo_token
    }
    response = requests.get(historical_endpoint_api, params=query_params)
    if response.status_code == requests.codes.ok:
        return parser.parse_chart(response.json())
    else:
        return abort(404)

@app.route("/stock/api/v1.0/news/<ticker>", methods=["GET"])
def news(ticker):
    if not utils.is_valid_ticker(ticker):
        return abort(404)
    news_api = "https://newsapi.org/v2/everything"

    page = 1
    news_articles = {}
    news_articles["articles"] = []

    while True:
        query_params = {
            "apiKey": news_api_token,
            "q": ticker,
            "page": page
        }

        response = requests.get(news_api, params=query_params)

        if response.status_code == requests.codes.ok:
            piece_response = parser.parse_news(response.json())
            for article in piece_response["articles"]:
                news_articles["articles"].append(article)
                if len(news_articles["articles"]) == 5:
                    return news_articles # all articles found!
            page = page + 1
        else:
            if len(news_articles["articles"]) == 0:
                return utils.return_news_error() # no articles found
            else:
                return news_articles # some (< 5) articles found