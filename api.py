from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from weather import get_havadurumu
from weather import get_weather_day
from weather import get_iki_gun_arasi
from weather import getSon30Gun

app = FastAPI(
    title="Weather REST API",
    description="Visual Crossing hava durumu REST API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Weather REST API çalışıyor"
    }


@app.get("/weather")
def weather(
    enlem: float = 39.9207,
    boylam: float = 32.8541
):
    """
    Belirtilen koordinat için hava durumu bilgilerini getirir.
    """

    try:
        data = get_havadurumu(enlem, boylam)

        return {
            "success": True,
            "latitude": enlem,
            "longitude": boylam,
            "data": data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/weather/day")
def gunluk_hava_d(
    gun: str = "2026-09-20",
    enlem: float = 39.9207,
    boylam: float = 32.8541
):
    try:
        data = get_weather_day(enlem,boylam,gun)

        return {
            "success": True,
            "day": gun,
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=411,
            detail=str(e)
        )

@app.get("/weather/day/aralik")
def gun_aralik(
    gun1: str = "2026-09-01",
    gun2: str = "2026-09-20",
    enlem: float = 39.9207,
    boylam: float = 32.8541
):
    try:
        data = get_iki_gun_arasi(enlem,boylam,gun1,gun2)

        return {
            "success": True,
            "day1": gun1,
            "day2": gun2,
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=411,
            detail=str(e)
        )

@app.get("/weather/day/Son30Gun")
def otuzgun(
    enlem: float = 39.9207,
    boylam: float = 32.8541
):
    try:
        data = getSon30Gun(enlem,boylam)

        return {
            "success": True,
            "enlem": enlem,
            "boylam": boylam,
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=411,
            detail=str(e)
        )