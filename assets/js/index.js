const selected = document.querySelector(".selected");
const selectedP = document.querySelector(".selectedP");
const optionsContainer = document.querySelector(".options");
const optionsList = document.querySelectorAll(".options div");
const container = document.getElementById('cards-container')
const searchInput = document.getElementById('search-input');



searchInput.addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();

  if (query === '') {
    suggestionsBox.innerHTML = '';
    renderCards(allCountries); 
    return;
  }

  const matched = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  renderCards(matched); 
  showSuggestions(matched.slice(0, 5)); 
});


 




selected.addEventListener("click", () => {
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
});

optionsList.forEach(o => {
  o.addEventListener("click", () => {
    const selectedRegion = o.getAttribute('data-value');
    selectedP.textContent = o.textContent;
    optionsContainer.style.display = "none";

    
    if (selectedRegion === 'All') {
      renderCards(allCountries);
    } else {
      const filtered = allCountries.filter(c => c.region === selectedRegion);
      renderCards(filtered);
    }
  });
});


window.addEventListener("click", function(e) {
  if (!document.querySelector(".custom-select").contains(e.target)) {
    optionsContainer.style.display = "none";
  }
});


let allCountries = []; 

fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(countries => {
    allCountries = countries;
    renderCards(allCountries); 
  })
  .catch(error => {
    console.error('Error fetching countries:', error);
    container.innerHTML = '<p>Failed to load countries.</p>';
  });


function renderCards(countries) {
  container.innerHTML = ''; 
  countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'card';

    const flag = country.flags.svg || country.flags.png;
    const name = country.name.common || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const region = country.region || 'N/A';
    const capital = country.capital?.[0] || 'N/A';

    card.innerHTML = `
      <div class="flag">
        <img src="${flag}" alt="${name} flag">
      </div>
      <div class="country-info">
        <h3><a href="details.html?name=${encodeURIComponent(name)}">${name}</a></h3>
        <p><strong>Population:</strong> <span>${population}</span></p>
        <p><strong>Region:</strong> <span>${region}</span></p>
        <p><strong>Capital:</strong> <span>${capital}</span></p>
      </div>
    `;

    container.appendChild(card);
  });
}

fetch('./pages/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
      })
      .catch(error => console.error('Error loading header:', error));
