
jQuery(function($){
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  function unitLabel(units){ return units === 'imperial' ? '°F' : '°C'; }
  function windUnit(units){ return units === 'imperial' ? 'mph' : 'm/s'; }

  async function fetchWeather({city, lat, lon, apiKey, units='metric', lang='en'}) {
    const params = new URLSearchParams({appid: apiKey, units, lang});
    if (lat && lon) { params.set('lat', lat); params.set('lon', lon); }
    else if (city) { params.set('q', city); }
    const res = await fetch(`${API_URL}?${params.toString()}`);
    if (!res.ok) { throw new Error('HTTP '+res.status); }
    return res.json();
  }

  $('.weather-widget').each(function(){
    const root = $(this);
    const city = root.data('city') || '';
    const apiKey = root.data('apikey') || '';
    let units = (root.data('units') || 'metric');
    const showDetails = (root.data('details') === 'yes');

    root.html(`
      <div class="weather-widget__top">
        <div class="weather-widget__city">${city ? city : '—'}</div>
        <div class="weather-widget__controls">
          <button class="weather-widget__btn js-units">${units === 'imperial' ? '°F' : '°C'}</button>
          <button class="weather-widget__btn js-geo">My location</button>
        </div>
      </div>
      <div class="weather-widget__main">
        <div class="weather-widget__icon"></div>
        <div class="weather-widget__temp">—</div>
        <div class="weather-widget__desc">—</div>
      </div>
      ${showDetails ? `<div class="weather-widget__details">
        <div class="w-detail w-feels">It is felt: —</div>
        <div class="w-detail w-hum">Humidity: —</div>
        <div class="w-detail w-wind">Wind: —</div>
      </div>` : ``}
    `);

    async function renderByCity(c) {
      if (!apiKey) { root.find('.weather-widget__desc').text('Нет API ключа'); return; }
      try{ const d = await fetchWeather({city: c, apiKey, units, lang: 'en'}); renderData(d); }
      catch(e){ root.find('.weather-widget__desc').text('Ошибка загрузки'); console.error(e); }
    }
    async function renderByGeo(lat, lon) {
      if (!apiKey) { root.find('.weather-widget__desc').text('Нет API ключа'); return; }
      try{
        const d = await fetchWeather({lat, lon, apiKey, units, lang: 'en'});
        if (d && d.name) root.find('.weather-widget__city').text(d.name);
        renderData(d);
      } catch(e){ root.find('.weather-widget__desc').text('Ошибка геоданных'); console.error(e); }
    }

    function renderData(d){
      const temp = Math.round(d.main.temp);
      const feels = Math.round(d.main.feels_like);
      const hum = d.main.humidity;
      const wind = d.wind && d.wind.speed != null ? d.wind.speed : 0;
      const desc = d.weather && d.weather[0] ? d.weather[0].description : '';
      const icon = d.weather && d.weather[0] && d.weather[0].icon ? d.weather[0].icon : null;

      root.find('.weather-widget__temp').text(`${temp}${unitLabel(units)}`);
      root.find('.weather-widget__desc').text(desc || '—');
      if (icon) {
        root.find('.weather-widget__icon').html(`<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">`);
      } else { root.find('.weather-widget__icon').empty(); }

      if (showDetails) {
        root.find('.w-feels').text(`It is felt: ${feels}${unitLabel(units)}`);
        root.find('.w-hum').text(`Humidity: ${hum}%`);
        root.find('.w-wind').text(`Wind: ${wind} ${windUnit(units)}`);
      }
    }

    if (city) { renderByCity(city); }

    root.on('click', '.js-units', function(){
      units = (units === 'metric') ? 'imperial' : 'metric';
      $(this).text(units === 'imperial' ? '°F' : '°C');
      const currentCity = root.find('.weather-widget__city').text() || city;
      if (currentCity && currentCity !== '—') { renderByCity(currentCity); }
    });

    root.on('click', '.js-geo', function(){
      const btn = $(this);
      if (!navigator.geolocation) { alert('Геолокация не поддерживается.'); return; }
      btn.prop('disabled', true).text('Определяю...');
      navigator.geolocation.getCurrentPosition(
        (pos)=>{ btn.prop('disabled', false).text('Моё местоположение'); renderByGeo(pos.coords.latitude, pos.coords.longitude); },
        (err)=>{ console.error(err); btn.prop('disabled', false).text('Моё местоположение'); alert('Не удалось получить геопозицию'); },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 }
      );
    });
  });
});