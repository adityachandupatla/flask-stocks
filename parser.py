from dateutil.relativedelta import relativedelta
import datetime

import utils

def parse_company_outlook(server_response):
	# Need to verify the return values of the API and see whether we are handling it
    # appropriately or not

    # Note: Special characters like the quotes in '(Nasdaq “MSFT” @microsoft)' can
    # be returned and our UI might not support that. Need to check it (for all API's)
    required_response = {}
    # Need to verify what to do if keys do not exist (for all API's)
    required_response["Company Name"] = server_response["name"]
    required_response["Stock Ticker Symbol"] = server_response["ticker"]
    required_response["Stock Exchange Code"] = server_response["exchangeCode"]
    required_response["Company Start Date"] = server_response["startDate"]
    # The description needs to be truncated with an ellipsis (“triple dots”) so as to only span the
    # first FIVE lines.
    required_response["Description"] = server_response["description"]
    return required_response

def parse_stock_summary(server_response):
    required_response = {}
    required_response["Stock Ticker Symbol"] = server_response["ticker"]
    required_response["Trading Day"] = datetime.datetime.strptime(server_response["timestamp"], "%Y-%m-%dT%H:%M:%S+00:00").date().strftime("%Y-%m-%d")
    required_response["Previous Closing Price"] = server_response["prevClose"]
    required_response["Opening Price"] = server_response["open"]
    required_response["High Price"] = server_response["high"]
    required_response["Low Price"] = server_response["low"]
    required_response["Last Price"] = server_response["last"]
    # display the upward arrow or downward arrow depending on whether the difference value is positive or negative
    change = float(server_response["last"]) - float(server_response["prevClose"])
    required_response["Change"] = round(change, 2)
    # display the upward arrow or downward arrow depending on whether the difference value is positive or negative
    percent_change = (change / float(server_response["prevClose"])) * 100
    required_response["Change Percent"] = round(percent_change, 2)
    required_response["Number of Shares Traded"] = server_response["volume"]
    return required_response

def parse_chart(server_response_list):
    required_response = {}
    required_response["chartdata"] = []
    for intraday_response in server_response_list:
        chart_info = {}
        chart_info["Date"] = datetime.datetime.strptime(intraday_response["date"], "%Y-%m-%dT%H:%M:%S.000Z").date().strftime("%Y-%m-%d")
        chart_info["Stock Price"] = intraday_response["close"]
        chart_info["Volume"] = intraday_response["volume"]
        required_response["chartdata"].append(chart_info)
    return required_response

def parse_news(server_response):
    required_response = {}
    required_response["articles"] = []
    for article_response in server_response["articles"]:
        if utils.is_valid_article(article_response):
            article = {}
            article["Title"] = article_response["title"]
            article["Link to Original Post"] = article_response["url"]
            article["Image"] = article_response["urlToImage"]
            article["Date"] = datetime.datetime.strptime(article_response["publishedAt"], "%Y-%m-%dT%H:%M:%SZ").date().strftime("%m/%d/%Y")
            required_response["articles"].append(article)
            if len(required_response["articles"]) == 5:
                break
    # what to do if we have no article? Will the UI break?
    return required_response