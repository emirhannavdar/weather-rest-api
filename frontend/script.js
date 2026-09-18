const API_URL = "http://127.0.0.1:8000";


// =====================================================
// SAYFA BAŞLANGICI
// =====================================================

window.addEventListener("DOMContentLoaded", () => {

    checkAPI();

    setupTabs();

    setupEnterKeys();

});


// =====================================================
// API KONTROL
// =====================================================

async function checkAPI() {

    const status =
        document.getElementById("apiStatus");

    try {

        const response =
            await fetch(`${API_URL}/`);

        if (!response.ok) {

            throw new Error(
                "API cevap vermedi."
            );

        }

        status.innerHTML =
            "● API aktif";

        status.style.color =
            "#86efac";

    }

    catch (error) {

        status.innerHTML =
            "● API bağlantısı yok";

        status.style.color =
            "#fca5a5";

    }

}


// =====================================================
// TAB SİSTEMİ
// =====================================================

function setupTabs() {

    const tabs =
        document.querySelectorAll(".tab");

    const contents =
        document.querySelectorAll(".tab-content");


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                tabs.forEach(t => {

                    t.classList.remove(
                        "active"
                    );

                });


                contents.forEach(content => {

                    content.classList.remove(
                        "active"
                    );

                });


                tab.classList.add(
                    "active"
                );


                document
                    .getElementById(target)
                    .classList.add("active");

            }
        );

    });

}


// =====================================================
// ENTER TUŞU
// =====================================================

function setupEnterKeys() {

    document
        .querySelectorAll("input")
        .forEach(input => {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key !== "Enter"
                    ) {
                        return;
                    }


                    const section =
                        input.closest(
                            ".tab-content"
                        );


                    if (!section) {
                        return;
                    }


                    switch(section.id) {

                        case "general":

                            getGeneralWeather();

                            break;


                        case "day":

                            getDayWeather();

                            break;


                        case "range":

                            getRangeWeather();

                            break;


                        case "last30":

                            getLast30Days();

                            break;

                    }

                }
            );

        });

}


// =====================================================
// 1. GENEL HAVA
// GET /weather
// =====================================================

async function getGeneralWeather() {

    const lat =
        document.getElementById(
            "generalLat"
        ).value;

    const lon =
        document.getElementById(
            "generalLon"
        ).value;


    const result =
        document.getElementById(
            "generalResult"
        );


    if (!lat || !lon) {

        showError(
            result,
            "Enlem ve boylam bilgilerini giriniz."
        );

        return;
    }


    result.innerHTML =
        loading(
            "Hava durumu getiriliyor..."
        );


    const url =
        `${API_URL}/weather` +
        `?enlem=${encodeURIComponent(lat)}` +
        `&boylam=${encodeURIComponent(lon)}`;


    try {

        const response =
            await fetch(url);


        const json =
            await response.json();


        if (!response.ok) {

            throw new Error(
                json.detail ||
                "API hatası"
            );

        }


        renderWeatherResult(
            result,
            json,
            "Genel Hava Durumu"
        );

    }

    catch (error) {

        showError(
            result,
            `Hava durumu alınamadı: ${error.message}`
        );

    }

}


// =====================================================
// 2. TEK GÜN
// GET /weather/day
// =====================================================

async function getDayWeather() {

    const lat =
        document.getElementById(
            "dayLat"
        ).value;

    const lon =
        document.getElementById(
            "dayLon"
        ).value;

    const date =
        document.getElementById(
            "dayDate"
        ).value;


    const result =
        document.getElementById(
            "dayResult"
        );


    if (
        !lat ||
        !lon ||
        !date
    ) {

        showError(
            result,
            "Enlem, boylam ve tarih bilgilerini giriniz."
        );

        return;
    }


    result.innerHTML =
        loading(
            "Günlük hava durumu getiriliyor..."
        );


    const url =
        `${API_URL}/weather/day` +
        `?gun=${encodeURIComponent(date)}` +
        `&enlem=${encodeURIComponent(lat)}` +
        `&boylam=${encodeURIComponent(lon)}`;


    try {

        const response =
            await fetch(url);


        const json =
            await response.json();


        if (!response.ok) {

            throw new Error(
                json.detail ||
                "API hatası"
            );

        }


        renderWeatherResult(
            result,
            json,
            `${date} Hava Durumu`
        );

    }

    catch (error) {

        showError(
            result,
            `Hava durumu alınamadı: ${error.message}`
        );

    }

}


// =====================================================
// 3. TARİH ARALIĞI
// GET /weather/day/aralik
// =====================================================

async function getRangeWeather() {

    const lat =
        document.getElementById(
            "rangeLat"
        ).value;

    const lon =
        document.getElementById(
            "rangeLon"
        ).value;

    const start =
        document.getElementById(
            "rangeStart"
        ).value;

    const end =
        document.getElementById(
            "rangeEnd"
        ).value;


    const result =
        document.getElementById(
            "rangeResult"
        );


    if (
        !lat ||
        !lon ||
        !start ||
        !end
    ) {

        showError(
            result,
            "Tüm alanları doldurunuz."
        );

        return;
    }


    if (start > end) {

        showError(
            result,
            "Başlangıç tarihi, bitiş tarihinden sonra olamaz."
        );

        return;
    }


    result.innerHTML =
        loading(
            "Tarih aralığı getiriliyor..."
        );


    const url =
        `${API_URL}/weather/day/aralik` +
        `?gun1=${encodeURIComponent(start)}` +
        `&gun2=${encodeURIComponent(end)}` +
        `&enlem=${encodeURIComponent(lat)}` +
        `&boylam=${encodeURIComponent(lon)}`;


    try {

        const response =
            await fetch(url);


        const json =
            await response.json();


        if (!response.ok) {

            throw new Error(
                json.detail ||
                "API hatası"
            );

        }


        renderRangeResult(
            result,
            json,
            start,
            end
        );

    }

    catch (error) {

        showError(
            result,
            `Hava durumu alınamadı: ${error.message}`
        );

    }

}


// =====================================================
// 4. SON 30 GÜN
// GET /weather/day/Son30Gun
// =====================================================

async function getLast30Days() {

    const lat =
        document.getElementById(
            "last30Lat"
        ).value;

    const lon =
        document.getElementById(
            "last30Lon"
        ).value;


    const result =
        document.getElementById(
            "last30Result"
        );


    if (!lat || !lon) {

        showError(
            result,
            "Enlem ve boylam bilgilerini giriniz."
        );

        return;
    }


    result.innerHTML =
        loading(
            "Son 30 günlük veriler getiriliyor..."
        );


    const url =
        `${API_URL}/weather/day/Son30Gun` +
        `?enlem=${encodeURIComponent(lat)}` +
        `&boylam=${encodeURIComponent(lon)}`;


    try {

        const response =
            await fetch(url);


        const json =
            await response.json();


        if (!response.ok) {

            throw new Error(
                json.detail ||
                "API hatası"
            );

        }


        renderLast30Days(
            result,
            json
        );

    }

    catch (error) {

        showError(
            result,
            `Son 30 gün alınamadı: ${error.message}`
        );

    }

}


// =====================================================
// NORMAL HAVA SONUCU
// =====================================================

function renderWeatherResult(
    container,
    json,
    title
) {

    const data =
        json.data;


    if (!data) {

        showError(
            container,
            "API sonucunda data alanı bulunamadı."
        );

        return;
    }


    const days =
        data.days || [];


    const day =
        days.length > 0
            ? days[0]
            : null;


    if (!day) {

        showError(
            container,
            "API sonucunda günlük hava verisi bulunamadı."
        );

        return;
    }


    container.innerHTML = `

        <div class="result-header">

            <div>

                <h2>
                    ${escapeHtml(title)}
                </h2>

                <div class="location">
                    📍 ${escapeHtml(
                        data.resolvedAddress ||
                        data.address ||
                        "Bilinmeyen konum"
                    )}
                </div>

            </div>

            <div class="location">

                📅 ${formatDate(day.datetime)}

            </div>

        </div>


        <div class="weather-main">

            <div>

                <div class="temperature">
                    ${value(day.temp)} °C
                </div>

                <div class="condition">
                    ${escapeHtml(
                        day.conditions || "-"
                    )}
                </div>

                <div class="description">
                    ${escapeHtml(
                        day.description || "-"
                    )}
                </div>

            </div>


            <div class="weather-icon">
                ${getWeatherIcon(day.icon)}
            </div>

        </div>


        <h3 class="result-header">
            🌡️ Sıcaklık
        </h3>

        <div class="card-grid">

            ${infoCard(
                "Hissedilen",
                `${value(day.feelslike)} °C`
            )}

            ${infoCard(
                "Maksimum",
                `${value(day.tempmax)} °C`
            )}

            ${infoCard(
                "Minimum",
                `${value(day.tempmin)} °C`
            )}

            ${infoCard(
                "Çiy Noktası",
                `${value(day.dew)} °C`
            )}

        </div>


        <h3 class="result-header">
            🌬️ Atmosfer
        </h3>

        <div class="card-grid">

            ${infoCard(
                "Nem",
                `${value(day.humidity)} %`
            )}

            ${infoCard(
                "Basınç",
                value(day.pressure)
            )}

            ${infoCard(
                "Bulutluluk",
                `${value(day.cloudcover)} %`
            )}

            ${infoCard(
                "Görüş",
                value(day.visibility)
            )}

            ${infoCard(
                "Rüzgar",
                `${value(day.windspeed)} km/h`
            )}

            ${infoCard(
                "Rüzgar Hamlesi",
                `${value(day.windgust)} km/h`
            )}

            ${infoCard(
                "Rüzgar Yönü",
                `${value(day.winddir)}°`
            )}

        </div>


        <h3 class="result-header">
            🌧️ Yağış ve Kar
        </h3>

        <div class="card-grid">

            ${infoCard(
                "Yağış",
                value(day.precip)
            )}

            ${infoCard(
                "Yağış Olasılığı",
                `${value(day.precipprob)} %`
            )}

            ${infoCard(
                "Yağış Kapsamı",
                `${value(day.precipcover)} %`
            )}

            ${infoCard(
                "Yağış Tipi",
                formatValue(day.preciptype)
            )}

            ${infoCard(
                "Kar",
                value(day.snow)
            )}

            ${infoCard(
                "Kar Derinliği",
                value(day.snowdepth)
            )}

        </div>


        <h3 class="result-header">
            ☀️ Güneş
        </h3>

        <div class="card-grid">

            ${infoCard(
                "Gün Doğumu",
                formatValue(day.sunrise)
            )}

            ${infoCard(
                "Gün Batımı",
                formatValue(day.sunset)
            )}

            ${infoCard(
                "Güneş Radyasyonu",
                value(day.solarradiation)
            )}

            ${infoCard(
                "Güneş Enerjisi",
                value(day.solarenergy)
            )}

            ${infoCard(
                "UV Index",
                value(day.uvindex)
            )}

            ${infoCard(
                "Ay Fazı",
                value(day.moonphase)
            )}

        </div>


        <h3 class="result-header">
            📡 API Bilgileri
        </h3>

        <div class="card-grid">

            ${infoCard(
                "Enlem",
                value(data.latitude)
            )}

            ${infoCard(
                "Boylam",
                value(data.longitude)
            )}

            ${infoCard(
                "Timezone",
                formatValue(data.timezone)
            )}

            ${infoCard(
                "UTC Offset",
                value(data.tzoffset)
            )}

            ${infoCard(
                "Query Cost",
                value(data.queryCost)
            )}

            ${infoCard(
                "Kaynak",
                formatValue(day.source)
            )}

            ${infoCard(
                "İstasyonlar",
                formatValue(day.stations)
            )}

            ${infoCard(
                "Ciddi Hava Riski",
                value(day.severerisk)
            )}

        </div>


        ${rawJson(json)}

    `;

}


// =====================================================
// TARİH ARALIĞI
// =====================================================

function renderRangeResult(
    container,
    json,
    start,
    end
) {

    const data =
        json.data;


    const days =
        data.days || [];


    let html = `

        <div class="result-header">

            <div>

                <h2>
                    📆 Tarih Aralığı
                </h2>

                <div class="location">
                    📍 ${escapeHtml(
                        data.resolvedAddress ||
                        data.address ||
                        "-"
                    )}
                </div>

            </div>


            <div class="location">

                ${start} → ${end}

            </div>

        </div>


        <div class="days-grid">
    `;


    days.forEach(day => {

        html += `

            <div class="day-card">

                <h3>
                    📅 ${formatDate(
                        day.datetime
                    )}
                </h3>


                <div class="weather-icon">
                    ${getWeatherIcon(
                        day.icon
                    )}
                </div>


                <div class="day-temp">
                    ${value(day.temp)} °C
                </div>


                <div class="day-condition">
                    ${escapeHtml(
                        day.conditions || "-"
                    )}
                </div>


                <div class="card-grid">

                    ${infoCard(
                        "Min",
                        `${value(day.tempmin)} °C`
                    )}

                    ${infoCard(
                        "Max",
                        `${value(day.tempmax)} °C`
                    )}

                    ${infoCard(
                        "Hissedilen",
                        `${value(day.feelslike)} °C`
                    )}

                    ${infoCard(
                        "Nem",
                        `${value(day.humidity)} %`
                    )}

                    ${infoCard(
                        "Yağış",
                        value(day.precip)
                    )}

                    ${infoCard(
                        "Yağış Olasılığı",
                        `${value(day.precipprob)} %`
                    )}

                    ${infoCard(
                        "Rüzgar",
                        `${value(day.windspeed)} km/h`
                    )}

                    ${infoCard(
                        "UV",
                        value(day.uvindex)
                    )}

                </div>

            </div>

        `;

    });


    html += `

        </div>


        <h3 class="result-header">
            📡 API Bilgileri
        </h3>


        <div class="card-grid">

            ${infoCard(
                "Toplam Gün",
                days.length
            )}

            ${infoCard(
                "Enlem",
                value(data.latitude)
            )}

            ${infoCard(
                "Boylam",
                value(data.longitude)
            )}

            ${infoCard(
                "Timezone",
                formatValue(data.timezone)
            )}

            ${infoCard(
                "UTC Offset",
                value(data.tzoffset)
            )}

            ${infoCard(
                "Query Cost",
                value(data.queryCost)
            )}

        </div>


        ${rawJson(json)}

    `;


    container.innerHTML =
        html;

}


// =====================================================
// SON 30 GÜN
// =====================================================

function renderLast30Days(
    container,
    json
) {

    const data =
        json.data;


    if (!data) {

        showError(
            container,
            "API sonucunda data alanı bulunamadı."
        );

        return;
    }


    const days =
        data.days || [];


    if (days.length === 0) {

        showError(
            container,
            "Son 30 gün için veri bulunamadı."
        );

        return;
    }


    // ---------------------------------------------
    // İSTATİSTİKLER
    // ---------------------------------------------

    const temperatures =
        days
            .map(d => Number(d.temp))
            .filter(n => !isNaN(n));


    const maxTemperatures =
        days
            .map(d => Number(d.tempmax))
            .filter(n => !isNaN(n));


    const minTemperatures =
        days
            .map(d => Number(d.tempmin))
            .filter(n => !isNaN(n));


    const avgTemp =
        temperatures.length
            ? (
                temperatures.reduce(
                    (a, b) => a + b,
                    0
                )
                /
                temperatures.length
            ).toFixed(1)
            : "-";


    const highest =
        maxTemperatures.length
            ? Math.max(
                ...maxTemperatures
            ).toFixed(1)
            : "-";


    const lowest =
        minTemperatures.length
            ? Math.min(
                ...minTemperatures
            ).toFixed(1)
            : "-";


    let html = `

        <div class="result-header">

            <div>

                <h2>
                    📊 Son 30 Gün
                </h2>

                <div class="location">
                    📍 ${escapeHtml(
                        data.resolvedAddress ||
                        data.address ||
                        "-"
                    )}
                </div>

            </div>

        </div>


        <!-- ÖZET -->

        <div class="history-summary">

            <div class="summary-card">

                <div class="summary-title">
                    Veri Sayısı
                </div>

                <div class="summary-value">
                    ${days.length}
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-title">
                    Ortalama Sıcaklık
                </div>

                <div class="summary-value">
                    ${avgTemp} °C
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-title">
                    En Yüksek
                </div>

                <div class="summary-value">
                    ${highest} °C
                </div>

            </div>


            <div class="summary-card">

                <div class="summary-title">
                    En Düşük
                </div>

                <div class="summary-value">
                    ${lowest} °C
                </div>

            </div>

        </div>


        <!-- GÜNLER -->

        <h3 class="result-header">
            📅 Günlük Veriler
        </h3>


        <div class="days-grid">
    `;


    days.forEach(day => {

        html += `

            <div class="day-card">

                <h3>
                    📅 ${formatDate(
                        day.datetime
                    )}
                </h3>


                <div class="weather-icon">
                    ${getWeatherIcon(
                        day.icon
                    )}
                </div>


                <div class="day-temp">
                    ${value(day.temp)} °C
                </div>


                <div class="day-condition">
                    ${escapeHtml(
                        day.conditions || "-"
                    )}
                </div>


                <div class="card-grid">

                    ${infoCard(
                        "Minimum",
                        `${value(day.tempmin)} °C`
                    )}

                    ${infoCard(
                        "Maksimum",
                        `${value(day.tempmax)} °C`
                    )}

                    ${infoCard(
                        "Hissedilen",
                        `${value(day.feelslike)} °C`
                    )}

                    ${infoCard(
                        "Nem",
                        `${value(day.humidity)} %`
                    )}

                    ${infoCard(
                        "Yağış",
                        value(day.precip)
                    )}

                    ${infoCard(
                        "Yağış Olasılığı",
                        `${value(day.precipprob)} %`
                    )}

                    ${infoCard(
                        "Rüzgar",
                        `${value(day.windspeed)} km/h`
                    )}

                    ${infoCard(
                        "UV",
                        value(day.uvindex)
                    )}

                </div>

            </div>

        `;

    });


    html += `

        </div>


        <!-- API BİLGİLERİ -->

        <h3 class="result-header">
            📡 API Bilgileri
        </h3>


        <div class="card-grid">

            ${infoCard(
                "Enlem",
                value(data.latitude)
            )}

            ${infoCard(
                "Boylam",
                value(data.longitude)
            )}

            ${infoCard(
                "Timezone",
                formatValue(data.timezone)
            )}

            ${infoCard(
                "UTC Offset",
                value(data.tzoffset)
            )}

            ${infoCard(
                "Query Cost",
                value(data.queryCost)
            )}

        </div>


        ${rawJson(json)}

    `;


    container.innerHTML =
        html;

}


// =====================================================
// BİLGİ KARTI
// =====================================================

function infoCard(
    title,
    valueText
) {

    return `

        <div class="info-card">

            <div class="info-title">
                ${escapeHtml(title)}
            </div>

            <div class="info-value">
                ${valueText}
            </div>

        </div>

    `;

}


// =====================================================
// RAW JSON
// =====================================================

function rawJson(json) {

    return `

        <div class="json-section">

            <details>

                <summary>
                    🧾 API'nin Döndürdüğü Tam JSON
                </summary>

                <pre>${escapeHtml(
                    JSON.stringify(
                        json,
                        null,
                        2
                    )
                )}</pre>

            </details>

        </div>

    `;

}


// =====================================================
// WEATHER ICON
// =====================================================

function getWeatherIcon(icon) {

    const icons = {

        "clear-day":
            "☀️",

        "clear-night":
            "🌙",

        "partly-cloudy-day":
            "⛅",

        "partly-cloudy-night":
            "☁️",

        "cloudy":
            "☁️",

        "rain":
            "🌧️",

        "showers-day":
            "🌦️",

        "showers-night":
            "🌧️",

        "thunder-rain":
            "⛈️",

        "thunder-showers-day":
            "⛈️",

        "thunder-showers-night":
            "⛈️",

        "snow":
            "❄️",

        "snow-showers-day":
            "🌨️",

        "snow-showers-night":
            "🌨️",

        "fog":
            "🌫️",

        "wind":
            "💨"

    };


    return icons[icon] || "🌤️";

}


// =====================================================
// DEĞER FORMATLAMA
// =====================================================

function value(val) {

    if (
        val === null ||
        val === undefined ||
        val === ""
    ) {

        return "-";

    }


    if (
        typeof val === "number" &&
        !Number.isInteger(val)
    ) {

        return val.toFixed(1);

    }


    return escapeHtml(val);

}


// =====================================================
// GENEL FORMAT
// =====================================================

function formatValue(val) {

    if (
        val === null ||
        val === undefined
    ) {

        return "-";

    }


    if (Array.isArray(val)) {

        return val.length
            ? escapeHtml(
                val.join(", ")
            )
            : "-";

    }


    if (
        typeof val === "object"
    ) {

        return escapeHtml(
            JSON.stringify(val)
        );

    }


    return escapeHtml(val);

}


// =====================================================
// TARİH FORMAT
// =====================================================

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHtml(
            dateString
        );

    }


    return date.toLocaleDateString(
        "tr-TR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


// =====================================================
// LOADING
// =====================================================

function loading(message) {

    return `

        <div class="loading">
            ⏳ ${escapeHtml(message)}
        </div>

    `;

}


// =====================================================
// ERROR
// =====================================================

function showError(
    container,
    message
) {

    container.innerHTML = `

        <div class="error">
            ⚠️ ${escapeHtml(message)}
        </div>

    `;

}


// =====================================================
// HTML GÜVENLİĞİ
// =====================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}