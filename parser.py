from dateutil.relativedelta import relativedelta
import datetime

import utils

parse_error_msg = "[Unable to parse]"

def parse_company_outlook(server_response):
    required_response = {}
    
    if not isinstance(server_response, dict):
        required_response["parsing"] = False
        return required_response

    required_response["parsing"] = True

    if "name" in server_response:
        required_response["Company Name"] = server_response["name"]
    else:
        required_response["Company Name"] = parse_error_msg

    if "ticker" in server_response:
        required_response["Stock Ticker Symbol"] = server_response["ticker"]
    else:
        required_response["Stock Ticker Symbol"] = parse_error_msg

    if "exchangeCode" in server_response:
        required_response["Stock Exchange Code"] = server_response["exchangeCode"]
    else:
        required_response["Stock Exchange Code"] = parse_error_msg

    if "startDate" in server_response:
        required_response["Company Start Date"] = server_response["startDate"]
    else:
        required_response["Company Start Date"] = parse_error_msg

    if "description" in server_response:
        required_response["Description"] = server_response["description"]
    else:
        required_response["Description"] = parse_error_msg

    return required_response

def parse_stock_summary(server_response):
    required_response = {}

    if not isinstance(server_response, dict):
        required_response["parsing"] = False
        return required_response

    required_response["parsing"] = True

    if "ticker" in server_response:
        required_response["Stock Ticker Symbol"] = server_response["ticker"]
    else:
        required_response["Stock Ticker Symbol"] = parse_error_msg

    if "timestamp" in server_response:
        try:
            required_response["Trading Day"] = datetime.datetime.strptime(server_response["timestamp"], "%Y-%m-%dT%H:%M:%S+00:00").date().strftime("%Y-%m-%d")
        except:
            required_response["Trading Day"] = parse_error_msg
    else:
        required_response["Trading Day"] = parse_error_msg

    if "prevClose" in server_response:
        required_response["Previous Closing Price"] = server_response["prevClose"]
    else:
        required_response["Previous Closing Price"] = parse_error_msg

    if "open" in server_response:
        required_response["Opening Price"] = server_response["open"]
    else:
        required_response["Opening Price"] = parse_error_msg

    if "high" in server_response:
        required_response["High Price"] = server_response["high"]
    else:
        required_response["High Price"] = parse_error_msg

    if "low" in server_response:
        required_response["Low Price"] = server_response["low"]
    else:
        required_response["Low Price"] = parse_error_msg

    if "last" in server_response:
        required_response["Last Price"] = server_response["last"]
    else:
        required_response["Last Price"] = parse_error_msg

    
    if "last" in server_response and "prevClose" in server_response:
        try:
            change = float(server_response["last"]) - float(server_response["prevClose"])
            required_response["Change"] = round(change, 2)
            percent_change = (change / float(server_response["prevClose"])) * 100
            required_response["Change Percent"] = round(percent_change, 2)
        except:
            required_response["Change"] = parse_error_msg
            required_response["Change Percent"] = parse_error_msg
    else:
        required_response["Change"] = parse_error_msg
        required_response["Change Percent"] = parse_error_msg
    
    if "volume" in server_response:
        required_response["Number of Shares Traded"] = server_response["volume"]
    else:
        required_response["Number of Shares Traded"] = parse_error_msg

    return required_response

def parse_chart(server_response_list):
    required_response = {}

    if not isinstance(server_response_list, list) or len(server_response_list) == 0:
        required_response["parsing"] = False
        return required_response

    required_response["parsing"] = True

    required_response["chartdata"] = []
    for intraday_response in server_response_list:
        chart_info = {}

        if "date" in intraday_response:
            try:
                chart_info["Date"] = datetime.datetime.strptime(intraday_response["date"], "%Y-%m-%dT%H:%M:%S.000Z").date().strftime("%Y-%m-%d")
            except:
                chart_info["Date"] = parse_error_msg
                required_response["parsing"] = False
        else:
            chart_info["Date"] = parse_error_msg
            required_response["parsing"] = False

        if "close" in intraday_response:
            chart_info["Stock Price"] = intraday_response["close"]
        else:
            chart_info["Stock Price"] = parse_error_msg
            required_response["parsing"] = False

        if "volume" in intraday_response:
            chart_info["Volume"] = intraday_response["volume"]
        else:
            chart_info["Volume"] = parse_error_msg
            required_response["parsing"] = False

        required_response["chartdata"].append(chart_info)

    # if even one field parsing fails, then there's no point building the chart
    return required_response

def parse_news(server_response):
    required_response = {}

    if not isinstance(server_response, dict) or "articles" not in server_response:
        required_response["parsing"] = False
        return required_response

    required_response["parsing"] = True

    required_response["articles"] = []
    for article_response in server_response["articles"]:
        if utils.is_valid_article(article_response):
            article = {}
            article["Title"] = article_response["title"]
            article["Link to Original Post"] = article_response["url"]
            article["Image"] = article_response["urlToImage"]
            try:
                article["Date"] = datetime.datetime.strptime(article_response["publishedAt"], "%Y-%m-%dT%H:%M:%SZ").date().strftime("%m/%d/%Y")
            except:
                article["Date"] = parse_error_msg

            required_response["articles"].append(article)
            if len(required_response["articles"]) == 5:
                break
    return required_response