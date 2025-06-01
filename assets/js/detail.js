const countryDetails = document.getElementById('country-details');


const params = new URLSearchParams(window.location.search);
const countryName = params.get('name');

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then(res => res.json())
  .then(async data => {
    const country = data[0];

    const {
      name,
      flags,
      population,
      region,
      subregion,
      capital,
      tld,
      currencies,
      languages,
      borders,
    } = country;

    const currencyNames = currencies ? Object.values(currencies).map(c => c.name).join(', ') : 'N/A';
    const languageList = languages ? Object.values(languages).join(', ') : 'N/A';

    
    let borderList = 'None';
    if (borders && borders.length > 0) {
      const borderData = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`)
        .then(res => res.json());

      
      borderList = borderData.map(borderCountry => {
        const borderName = borderCountry.name.common;
        return `<a href="../pages/detail.html?name=${encodeURIComponent(borderName)}" class="border-link">${borderName}</a>`;
      }).join(' ');
    }

   
    countryDetails.innerHTML = `
      <div class="flag">
        <img src="${flags.svg}" alt="${name.common}">
      </div>
      <div class="details">
        <h3>${name.common}</h3>
        <div class="detail-info">
          <div class="left">
            <p><strong>Native Name:</strong> <span>${Object.values(name.nativeName || {})[0]?.common || name.common}</span></p>
            <p><strong>Population:</strong> <span>${population.toLocaleString()}</span></p>
            <p><strong>Region:</strong> <span>${region}</span></p>
            <p><strong>Sub Region:</strong> <span>${subregion}</span></p>
            <p><strong>Capital:</strong> <span>${capital?.[0] || 'N/A'}</span></p>
          </div>
          <div class="right">
            <p><strong>Top Level Domain:</strong> <span>${tld?.[0] || 'N/A'}</span></p>
            <p><strong>Currencies:</strong> <span>${currencyNames}</span></p>
            <p><strong>Languages:</strong> <span>${languageList}</span></p>
          </div>
        </div>
        <div class="border-countries">
          <p><strong>Border Countries:</strong></p>
          <div class="borders">${borderList}</div>
        </div>
      </div>
    `;
  })
  .catch(err => {
    countryDetails.innerHTML = `<p>Country not found.</p>`;
    console.error(err);
  });


fetch('../pages/header.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;

        
        const toggle = document.querySelector('.color-scheme');
        const body = document.body;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
          body.classList.add('dark');
        }

        toggle?.addEventListener('click', () => {
          body.classList.toggle('dark');
          const isDark = body.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
      });