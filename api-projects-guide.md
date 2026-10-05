# JavaScript API Project Guide

This guide turns the concepts practiced in the product cart into five projects that use public APIs. Build them in order if you are still becoming comfortable with JavaScript. Each project adds one or two new ideas while reusing the same basic pattern:

1. Read input from the page.
2. Request data with `fetch()`.
3. Convert the response to JSON.
4. Store the useful data in JavaScript state.
5. Render the state into the DOM.
6. Listen for user actions and render again when state changes.

## Before You Start

Use the existing project structure as a starting point:

```text
project-folder/
|-- index.html
|-- css/
|   `-- styles.css
`-- js/
    `-- app.js
```

Every project should include these page states:

- An initial message explaining what the user can search for
- A loading message while the request is running
- A useful result when the request succeeds
- A clear error message when the request fails
- An empty-result message when the API returns no matching items

A reusable request helper keeps error handling in one place:

```js
async function getJson(url) {
      const response = await fetch(url);

      if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
}
```

A basic request flow looks like this:

```js
async function loadData() {
      resultsContainer.textContent = 'Loading...';

      try {
            const data = await getJson(url);
            renderResults(data);
      } catch (error) {
            resultsContainer.textContent = 'Something went wrong. Please try again.';
            console.error(error);
      }
}
```

Do not put an API key in a frontend project unless the API explicitly provides a safe browser-only key. The APIs below can be used for learning without exposing private credentials.

---

## 1. Weather Dashboard

**API:** [Open-Meteo](https://open-meteo.com/)

### What to Build

Create a dashboard where a user enters a city and sees its current weather and a short forecast.

Display:

- City name
- Current temperature
- Weather description
- Wind speed
- High and low temperatures
- A five-day forecast

Open-Meteo needs latitude and longitude, so the project uses two requests:

1. Geocoding API: convert a city name into coordinates.
2. Forecast API: request weather for those coordinates.

### Suggested HTML

```html
<form class="weather-form">
      <label for="city">Search for a city</label>
      <input id="city" name="city" required>
      <button type="submit">Search</button>
</form>

<section class="status" aria-live="polite"></section>
<section class="weather-results"></section>
```

### Build It Step by Step

1. Add the form and results containers.
2. Listen for the form's `submit` event.
3. Read and trim the city value.
4. Request matching locations from the geocoding API.
5. Use the first location's latitude and longitude in a forecast request.
6. Store the weather response in a variable.
7. Render the current conditions and forecast cards with `map()`.
8. Add loading, error, and no-city-found states.
9. Add a unit toggle for Celsius and Fahrenheit.

### Useful Request Code

```js
const city = cityInput.value.trim();
const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
const locations = await getJson(geocodingUrl);

if (!locations.results || locations.results.length === 0) {
      throw new Error('City not found');
}

const location = locations.results[0];
const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
const forecast = await getJson(forecastUrl);
```

### Concepts Practiced

- Form events
- `async`/`await`
- Multiple dependent API requests
- URL encoding
- Arrays and `map()`
- Loading and error states
- Number formatting
- Conditional rendering

### Extension

Create a `weatherCodeDescriptions` object that converts Open-Meteo weather codes into readable descriptions and icons.

---

## 2. Country Explorer

**API:** [REST Countries](https://restcountries.com/)

### What to Build

Create a country directory that supports searching and filtering. Each result should show a flag, country name, region, population, and capital.

When a user clicks a country, show a detail view with its languages, currencies, borders, and neighboring countries.

### Suggested Features

- Search by country name
- Filter by region
- Sort by population or name
- Country detail view
- Back button to return to the results
- Graceful handling of missing capitals or currencies

### Suggested HTML

```html
<form class="country-search">
      <label for="country-name">Search countries</label>
      <input id="country-name" type="search">
</form>

<select class="region-filter">
      <option value="">All regions</option>
      <option value="Africa">Africa</option>
      <option value="Americas">Americas</option>
      <option value="Asia">Asia</option>
      <option value="Europe">Europe</option>
      <option value="Oceania">Oceania</option>
</select>

<section class="country-results"></section>
```

### Build It Step by Step

1. Fetch all countries when the page loads.
2. Render one card for each country with `map()`.
3. Add a search input and filter the local array as the user types.
4. Add a region dropdown and combine it with the search filter.
5. Add a sort control using `sort()`.
6. Put the country's code in a `data-country-code` attribute.
7. Use event delegation to handle clicks on any country card.
8. Fetch the selected country's detail data and render a detail page or panel.
9. Add a back button that restores the list view.

### Filtering Code

```js
function getVisibleCountries(countries, searchText, region) {
      const normalizedSearch = searchText.trim().toLowerCase();

      return countries.filter(country => {
            const matchesName = country.name.common.toLowerCase().includes(normalizedSearch);
            const matchesRegion = !region || country.region === region;
            return matchesName && matchesRegion;
      });
}
```

### Rendering Code

```js
function renderCountries(countries) {
      if (countries.length === 0) {
            resultsContainer.innerHTML = '<p>No countries matched your search.</p>';
            return;
      }

      resultsContainer.innerHTML = countries.map(country => `
            <article class="country-card" data-country-code="${country.cca3}">
                  <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                  <h2>${country.name.common}</h2>
                  <p>Population: ${country.population.toLocaleString()}</p>
                  <p>Region: ${country.region}</p>
            </article>
      `).join('');
}
```

### Concepts Practiced

- `filter()` and `sort()`
- Search input events
- Nested objects and arrays
- Event delegation
- Multiple views
- Missing data handling
- Separating filtering from rendering

### Extension

Add a favorites list. Store only country codes in `localStorage`, then rebuild the favorites from the country data when the page loads.

---

## 3. Recipe Finder

**API:** [TheMealDB](https://www.themealdb.com/api.php)

### What to Build

Create a recipe search application. Users can search for meals, view recipe cards, and open a detailed recipe with ingredients and instructions.

### Suggested Features

- Search by meal name
- Filter by category or cuisine
- Recipe cards with images
- Recipe detail view
- Ingredients and measurements
- Favorite recipes
- A random recipe button

### Build It Step by Step

1. Add a search form and submit listener.
2. Request meals using the search endpoint.
3. Render each meal as a card.
4. Store the meal ID in `data-meal-id`.
5. Add one click listener to the results container.
6. Request full details when a card is selected.
7. Build an ingredients array from the API's numbered properties.
8. Render the ingredients and instructions in a detail view.
9. Add a favorite button and save favorite IDs in `localStorage`.

TheMealDB represents ingredients as properties such as `strIngredient1`, `strIngredient2`, and so on. A loop can turn those properties into a simpler array:

```js
function getIngredients(meal) {
      const ingredients = [];

      for (let index = 1; index <= 20; index += 1) {
            const ingredient = meal[`strIngredient${index}`];
            const measurement = meal[`strMeasure${index}`];

            if (ingredient && ingredient.trim()) {
                  ingredients.push(`${measurement.trim()} ${ingredient.trim()}`);
            }
      }

      return ingredients;
}
```

### Request Code

```js
async function searchMeals(searchTerm) {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;
      const data = await getJson(url);
      return data.meals || [];
}
```

### Concepts Practiced

- Form submission
- URL query parameters
- Loops
- Dynamic property names
- Nested data transformation
- Event delegation
- `localStorage`
- Detail views and application state

### Extension

Add a weekly meal planner. Let users assign favorite recipes to days of the week and save the plan as a JSON string in `localStorage`.

---

## 4. GitHub Profile Explorer

**API:** [GitHub REST API](https://docs.github.com/en/rest)

### What to Build

Create a tool where users enter a GitHub username and see the user's profile, public repository count, and repositories.

Display:

- Avatar and username
- Name and biography
- Followers and following
- Repository list
- Repository stars, language, and description
- Links to the profile and repositories

### Build It Step by Step

1. Add a username form.
2. Fetch the user profile from `/users/{username}`.
3. Fetch repositories from `/users/{username}/repos`.
4. Render profile information and repository cards.
5. Sort repositories by stars or recent update date.
6. Show a useful message for a `404` response.
7. Add pagination or a "Load more" button.
8. Add a language filter using `filter()`.

### Request Code

```js
async function loadGitHubProfile(username) {
      const profile = await getJson(`https://api.github.com/users/${encodeURIComponent(username)}`);
      const repositories = await getJson(`${profile.repos_url}?sort=updated&per_page=20`);

      return { profile, repositories };
}
```

### Repository Rendering

```js
function renderRepositories(repositories) {
      repositoriesContainer.innerHTML = repositories.map(repository => `
            <article class="repository-card">
                  <h2><a href="${repository.html_url}" target="_blank" rel="noreferrer">${repository.name}</a></h2>
                  <p>${repository.description || 'No description provided.'}</p>
                  <span>${repository.language || 'Unknown language'}</span>
                  <span>${repository.stargazers_count} stars</span>
            </article>
      `).join('');
}
```

### Concepts Practiced

- Dependent API requests
- HTTP status errors
- `Promise`-based asynchronous code
- Object destructuring
- Sorting and filtering
- Pagination
- Optional or missing values
- Rendering external links safely

### Extension

Add a repository comparison mode. Let users select two repositories and compare stars, forks, issues, languages, and last update dates.

---

## 5. Book Search Library

**API:** [Open Library API](https://openlibrary.org/developers/api)

### What to Build

Create a searchable book library. Users can search by title or author, inspect book details, and save books to a personal reading list.

Display:

- Cover image
- Title
- Author
- First publication year
- Number of editions
- Subjects or categories
- A link to the Open Library record

### Build It Step by Step

1. Add a search form with a title or author option.
2. Request results from the Open Library search API.
3. Render a grid of book cards.
4. Build cover image URLs from each book's cover ID.
5. Add a "Save" button to each card.
6. Store saved book keys in `localStorage`.
7. Add a saved-books view.
8. Add a "Load more" button using the API's `page` parameter.
9. Handle books that have no cover, author, or publication year.

### Request Code

```js
let currentPage = 1;
let currentQuery = '';

async function searchBooks(query, page = 1) {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=20`;
      return getJson(url);
}
```

### Safe Cover URLs

```js
function getCoverUrl(book) {
      if (!book.cover_i) {
            return 'assets/images/book-placeholder.png';
      }

      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
}
```

### Saving a Book

```js
function saveBook(book) {
      const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
      const alreadySaved = savedBooks.some(savedBook => savedBook.key === book.key);

      if (!alreadySaved) {
            savedBooks.push({
                  key: book.key,
                  title: book.title,
                  author: book.author_name?.[0] || 'Unknown author',
                  coverId: book.cover_i || null
            });

            localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
      }
}
```

### Concepts Practiced

- Query strings and URL encoding
- Pagination
- Optional chaining
- Default values
- `some()` and `filter()`
- `localStorage`
- Persistent application state
- Handling incomplete API data

### Extension

Add reading status values such as `Want to read`, `Reading`, and `Finished`. Let users change the status and filter the reading list by status.

---

## Recommended Learning Order

1. **Weather Dashboard**: learn the complete request, loading, success, and error cycle.
2. **Country Explorer**: practice local filtering, sorting, and multiple views.
3. **Recipe Finder**: transform irregular API data and use persistent favorites.
4. **GitHub Profile Explorer**: combine related requests and handle HTTP errors.
5. **Book Search Library**: build a larger stateful application with pagination and saved data.

For every project, commit after each milestone. A useful milestone sequence is:

```text
1. Static HTML and CSS
2. Successful API request
3. Loading and error states
4. Dynamic rendering
5. User interaction
6. Persistent state
7. Responsive styling and accessibility
```

The goal is not only to make the API request work. The important practice is learning how data moves through the application: user input becomes a request, the response becomes state, and state becomes an updated interface.
