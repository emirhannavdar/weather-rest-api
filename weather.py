import requests
from config import BASE_URI, API_KEY

def get_havadurumu(enlem: float, boylam: float):
    url = (
        BASE_URI + f"{enlem}, {boylam}"
    )

    data = {
        "key" : API_KEY,
        "contentType" : "json",
        "unitGroup": "metric",
        "include": "days",
        "lang": "tr",
    }

    response = requests.get(
        url,
        params = data,
    )


    response.raise_for_status()
    return response.json()

def get_weather_day(enlem: float, boylam: float, gun: str):
    url = (
        BASE_URI + f"{enlem}, {boylam}/{gun}"
    )

    data = {
        "key" : API_KEY,
        "contentType" : "json",
        "unitGroup": "metric",
        "include": "days",
        "lang": "tr",
    }

    response = requests.get(
        url,
        params = data,
    )


    response.raise_for_status()
    return response.json()

def get_iki_gun_arasi(enlem: float,boylam: float,gun1: str,gun2: str):
    url = (
        BASE_URI + f"{enlem},{boylam}/{gun1}/{gun2}"
    )

    data = {
        "key" : API_KEY,
        "contentType" : "json",
        "unitGroup": "metric",
        "include": "days",
        "lang": "tr",
    }
    response = requests.get(
        url,
        params = data,
    )


    response.raise_for_status()
    return response.json()

def getSon30Gun(enlem: float,boylam: float):
    url = (
        BASE_URI + f"{enlem},{boylam}/last30days"
    )

    data = {
        "key" : API_KEY,
        "contentType" : "json",
        "unitGroup": "metric",
        "include": "days",
        "lang": "tr",
    }
    response = requests.get(
        url,
        params = data,
    )


    response.raise_for_status()
    return response.json()