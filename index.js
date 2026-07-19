// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Event Listener for the button
fetchButton.addEventListener('click', () => {
  const stateCode = stateInput.value.trim().toUpperCase();
  
  // Clear previous displays
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
  
  if (!stateCode) {
    displayError("Please enter a valid state abbreviation.");
    return;
  }
  
  fetchWeatherData(stateCode);
});

// Task 1: Fetch data from the NWS API
async function fetchWeatherData(state) {
  try {
    const response = await fetch(`${weatherApi}${state}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather alerts for this location.");
    }
    
    const data = await response.json();
    
    // Check if any alerts exist in the features array
    if (!data.features || data.features.length === 0) {
      displayError("No active weather alerts found for this state.");
      return;
    }
    
    displayWeather(data);
    
  } catch (error) {
    console.error(error);
    displayError(error.message || "An error occurred while fetching data.");
  }
}

// Task 2: Dynamically update the DOM with alert details
function displayWeather(data) {
  alertsDisplay.innerHTML = ''; // Clear container
  
  data.features.forEach(alert => {
    const properties = alert.properties;
    
    // Create an alert card element
    const alertCard = document.createElement('div');
    alertCard.className = 'alert-card';
    
    // Structure headline and description
    alertCard.innerHTML = `
      <h3>${properties.headline || "Weather Alert"}</h3>
      <p><strong>Severity:</strong> ${properties.severity || "Unknown"}</p>
      <p>${properties.description || "No detailed description available."}</p>
      <hr />
    `;
    
    alertsDisplay.appendChild(alertCard);
  });
}

// Task 3: Display user-friendly errors
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}