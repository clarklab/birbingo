const defaultBirds = [
  { name: 'Male Cardinal', points: 1 },
  { name: 'Female Cardinal', points: 1 },
  { name: 'Sparrow', points: 1 },
  { name: 'Ground Dove', points: 2 },
  { name: 'Hummingbird', points: 2 },
  { name: 'Bluejay', points: 2 },
  { name: 'Chickadee', points: 2 },
  { name: 'Titmouse', points: 2 },
  { name: 'Finch', points: 2 },
  { name: 'Mockingbird', points: 2 },
  { name: 'Crow', points: 3 },
  { name: 'Wren', points: 3 },
  { name: 'Ladderback Woodpecker', points: 3 },
  { name: 'Downy Woodpecker', points: 3 },
  { name: 'Flycatcher', points: 3 },
  { name: 'Vireo', points: 3 },
  { name: 'Starling', points: 3 },
  { name: 'Chimney Swift', points: 4 },
  { name: 'Cedar Waxwing', points: 4 },
  { name: 'Swallow', points: 4 },
  { name: 'Raven', points: 4 },
  { name: 'Robin', points: 4 },
  { name: 'Any predator bird', points: 5 },
  { name: 'Heron', points: 5 },
  { name: 'Painted Bunting', points: 10 },
];

const defaultLocations = [
  "Inks Lake State Park",
  "Bee Cave Central Park",
  "Pedernales Falls State Park",
  "Commons Ford Park",
  "McKinney Falls State Park"
];

let currentOuting = {
  location: '',
  notes: '',
  spottedBirds: [],
  totalPoints: 0,
  date: new Date().toISOString(),
};

// Load the locations from localStorage or use the default locations
let locations = JSON.parse(localStorage.getItem('locations')) || defaultLocations;

// Function to display the locations in the list
function displayLocations() {
  const locationList = document.getElementById('location-list');
  locationList.innerHTML = '';
  locations.forEach((location, index) => {
    const listItem = document.createElement('div');
    listItem.classList.add('settings-row');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = location;
    input.addEventListener('input', (event) => {
      locations[index] = event.target.value;
    });
    listItem.appendChild(input);
    locationList.appendChild(listItem);
  });
}

// Function to update the location select options
function updateLocationOptions() {
  const locationSelect = document.getElementById('location');
  locationSelect.innerHTML = ''; // Clear the existing options

  // Add an option for each location
  locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });
}

// Call this function inside the save-locations event listener
document.getElementById('save-locations').addEventListener('click', () => {
  // Remove any empty locations
  locations = locations.filter(location => location.trim() !== '');
  localStorage.setItem('locations', JSON.stringify(locations));
  displayLocations();

  // Update the location select options
  updateLocationOptions();
});


// Display the locations when the page loads
displayLocations();

// Handle adding a new location
document.getElementById('add-location').addEventListener('click', () => {
  const newLocationInput = document.getElementById('new-location');
  const newLocation = newLocationInput.value;
  if (newLocation) {
    locations.push(newLocation);
    localStorage.setItem('locations', JSON.stringify(locations));
    newLocationInput.value = '';
    displayLocations();
  }
});


let birds = JSON.parse(localStorage.getItem('birds')) || defaultBirds;

function resetToDefaults() {
  localStorage.setItem('birds', JSON.stringify(defaultBirds));
  birds = JSON.parse(localStorage.getItem('birds'));
  populateBirdList();
  populateSettingsBirdList();
}

document.getElementById('reset-defaults').addEventListener('click', () => {
  const confirmReset = confirm('Are you sure you want to reset the bird list to default values?');
  if (confirmReset) {
    resetToDefaults();
  }
});


let spottedBirds = [];
let totalPoints = 0;


// Populate the location dropdown
const locationSelect = document.getElementById('location');
locations.forEach((location, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = location;
  locationSelect.appendChild(option);
});

// Add a "Custom" option
const customOption = document.createElement('option');
customOption.value = 'custom';
customOption.textContent = 'Custom...';
locationSelect.appendChild(customOption);

// Create a custom location input and hide it initially
const customLocationInput = document.createElement('input');
customLocationInput.id = 'custom-location';
customLocationInput.style.display = 'none';
locationSelect.parentElement.appendChild(customLocationInput);

// Show the custom location input when the "Custom" option is selected
locationSelect.addEventListener('change', () => {
  if (locationSelect.value === 'custom') {
    customLocationInput.style.display = 'block';
  } else {
    customLocationInput.style.display = 'none';
  }
});

populateBirdList();

function toggleBirdSpotting(bird) {
  const index = spottedBirds.findIndex((spottedBird) => spottedBird.name === bird.name);
  const birdButton = document.querySelector(`[data-name="${bird.name}"]`);

  if (index === -1) {
    spottedBirds.push(bird);
    totalPoints += bird.points;
    birdButton.classList.add('spotted');
  } else {
    spottedBirds.splice(index, 1);
    totalPoints -= bird.points;
    birdButton.classList.remove('spotted');
  }

  document.getElementById('total-points').textContent = totalPoints;

  // Save the current session to localStorage
  localStorage.setItem('currentOuting', JSON.stringify({
    spottedBirds: spottedBirds,
    totalPoints: totalPoints
  }));
}

function loadSession() {
  let currentSession = JSON.parse(localStorage.getItem('currentOuting'));
  if (currentSession) {
    spottedBirds = currentSession.spottedBirds;
    totalPoints = currentSession.totalPoints;

    // Update the total points display
    document.getElementById('total-points').textContent = totalPoints;

    // Mark the spotted birds as spotted
    spottedBirds.forEach(bird => {
      const birdButton = document.querySelector(`[data-name="${bird.name}"]`);
      if (birdButton) {birdButton.classList.add('spotted');}
    });
  }
}
loadSession();


function populateBirdList() {
  const birdList = document.getElementById('bird-list');
  birdList.innerHTML = '';

  // Sort birds by points, then by name
  birds.sort((birdA, birdB) => {
    if (birdA.points !== birdB.points) {
      return birdA.points - birdB.points;
    } else {
      return birdA.name.localeCompare(birdB.name);
    }
  });

  birds.forEach((bird) => {
    const birdButton = document.createElement('button');
    birdButton.classList.add('bird-button');
    birdButton.dataset.name = bird.name;

    const birdName = document.createElement('span');
    birdName.classList.add('bird-name');
    birdName.textContent = bird.name;

    const birdPoints = document.createElement('span');
    birdPoints.classList.add('bird-points');
    birdPoints.textContent = bird.points;

    birdButton.appendChild(birdName);
    birdButton.appendChild(birdPoints);

    if (currentOuting.spottedBirds.some(spottedBird => spottedBird.name === bird.name)) {
      birdButton.classList.add('spotted');
    }

    birdButton.addEventListener('click', () => toggleBirdSpotting(bird));
    birdList.appendChild(birdButton);
    loadSession();
  });
}



document.querySelectorAll('.nav-item').forEach((navItem) => {
  navItem.addEventListener('click', (event) => {
    changeActiveView(event.currentTarget.dataset.view);
  });
});



document.getElementById('save-outing').addEventListener('click', () => {
  const locationSelect = document.getElementById('location');
  const customLocationInput = document.getElementById('custom-location');
  const notesInput = document.getElementById('notes');
  const date = new Date().toISOString();

  // Determine whether to use the selected location or the custom location
  const location = locationSelect.value !== 'custom'
    ? defaultLocations[locationSelect.value]
    : customLocationInput.value;

  const outing = {
    location, // use the location determined above
    notes: notesInput.value,
    spottedBirds: spottedBirds,
    totalPoints: totalPoints,
    date,
  };

  const outings = JSON.parse(localStorage.getItem('outings') || '[]');
  outings.push(outing);
  localStorage.setItem('outings', JSON.stringify(outings));

  // Clear the inputs and spotted birds list after saving
  locationSelect.value = defaultLocations[0]; // reset the location select to the first default location
  customLocationInput.value = ''; // clear the custom location input
  customLocationInput.style.display = 'none'; // hide the custom location input
  notesInput.value = '';
  spottedBirds = [];
  totalPoints = 0;
  localStorage.setItem('currentOuting', JSON.stringify(currentOuting));
  document.getElementById('total-points').textContent = totalPoints;
  document.querySelectorAll('.bird-button').forEach((button) => button.classList.remove('spotted'));


  // Show a confirmation message
  alert('Outing saved successfully!');
  changeActiveView('past-outings');
});






document.getElementById('add-bird').addEventListener('click', () => {
  const birdInput = document.createElement('input');
  const pointInput = document.createElement('input');

  birdInput.setAttribute('type', 'text');
  pointInput.setAttribute('type', 'number');

  document.getElementById('settings-bird-list').appendChild(birdInput);
  document.getElementById('settings-bird-list').appendChild(pointInput);
});

document.getElementById('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const birdInputs = Array.from(document.querySelectorAll('#settings-bird-list input[type="text"]'));
  const pointInputs = Array.from(document.querySelectorAll('#settings-bird-list input[type="number"]'));

  birds = birdInputs.reduce((birdList, birdInput, index) => {
    const birdName = birdInput.value.trim();

    if (birdName !== '') {
      birdList.push({
        name: birdName,
        points: parseInt(pointInputs[index].value),
      });
    }

    return birdList;
  }, []);

  localStorage.setItem('birds', JSON.stringify(birds));
  populateBirdList();

});



function populateSettingsBirdList() {
  const settingsBirdList = document.getElementById('settings-bird-list');
  settingsBirdList.innerHTML = '';

  birds.forEach((bird) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('settings-row');

    const birdInput = document.createElement('input');
    birdInput.setAttribute('type', 'text');
    birdInput.value = bird.name;
    birdInput.classList.add('bird-input');

    const pointInput = document.createElement('input');
    pointInput.setAttribute('type', 'number');
    pointInput.value = bird.points;
    pointInput.classList.add('point-input');

    rowDiv.appendChild(birdInput);
    rowDiv.appendChild(pointInput);
    settingsBirdList.appendChild(rowDiv);
  });
}


populateSettingsBirdList();

document.querySelector('.nav-item[data-view="settings"]').addEventListener('click', () => {
  populateSettingsBirdList();
});



function changeActiveView(viewId) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
  document.querySelector(`.nav-item[data-view="${viewId}"]`).classList.add('active');

  document.querySelectorAll('.view').forEach((view) => view.style.display = 'none');
  document.getElementById(viewId).style.display = 'block';

  // Call displayPastOutings() when the "Past Outings" view is activated
  if (viewId === 'past-outings') {
    displayPastOutings();
  }
}




function displayPastOutings() {
  const pastOutingsList = document.getElementById('past-outings-list');
  let outings = JSON.parse(localStorage.getItem('outings') || '[]');
  pastOutingsList.innerHTML = '';

  // Sort outings by most recent date
  outings.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (outings.length === 0) {
    const emptyOutingsDiv = document.createElement('div');
    emptyOutingsDiv.classList.add('empty-outings');
    const emptyOutingsTitle = document.createElement('h3');
    emptyOutingsTitle.textContent = "Let's get outside! ";
    const secondSentence = document.createElement('span');
    secondSentence.textContent = "No outings yet, start a new one today.";
    emptyOutingsTitle.appendChild(secondSentence);
    const emptyOutingsImage = document.createElement('img');
    emptyOutingsImage.setAttribute('src', 'birb.svg');
    emptyOutingsDiv.appendChild(emptyOutingsImage);
    emptyOutingsDiv.appendChild(emptyOutingsTitle);
    pastOutingsList.appendChild(emptyOutingsDiv);
  } else {
    outings = outings.map((outing, index) => {
      if (!outing.coords) {
        return lookupLocation(outing.location)
          .then(coords => {
            outing.coords = coords;
            return outing;
          });
      } else {
        return Promise.resolve(outing);
      }
    });

    Promise.all(outings).then((updatedOutings) => {
      updatedOutings.forEach((outing, index) => {
        const outingDiv = document.createElement('div');
        outingDiv.classList.add('past-outing');

        const outingTitle = document.createElement('h3');
        outingTitle.textContent = `${outing.location}`;

        const outingCoords = document.createElement('p');
        outingCoords.textContent = `${outing.coords.lat}, ${outing.coords.lon}`;

        const outingDate = document.createElement('p');
        const date = new Date(outing.date).toLocaleDateString();
        outingDate.innerHTML = `<span class="opacity-50">${date}</span>`;

        const spottedBirdsList = document.createElement('ul');
        outing.spottedBirds.forEach((bird) => {
          const spottedBird = document.createElement('li');
          spottedBird.textContent = `${bird.name} (${bird.points} points)`;
          spottedBirdsList.appendChild(spottedBird);
        });

        const outingInfo = document.createElement('div');
        outingInfo.innerHTML = `<div class="points">${outing.totalPoints} points</div><div class="notes"><span class="label">Notes</span>${outing.notes}</div><h4>Bird List</h4>`;

        const removeLink = document.createElement('a');
        removeLink.href = 'javascript:void(0)';
        removeLink.textContent = 'DROP';
        removeLink.style.color = 'red';

        removeLink.addEventListener('click', () => {
          const confirmDelete = confirm('Are you sure you want to delete this outing?');
          if (confirmDelete) {
            const outings = JSON.parse(localStorage.getItem('outings') || '[]');
            outings.splice(index, 1);
            localStorage.setItem('outings', JSON.stringify(outings));
            displayPastOutings();
          }
        });

        outingDiv.appendChild(outingTitle);
        outingDiv.appendChild(outingCoords);
        outingDiv.appendChild(outingInfo);
        outingDiv.appendChild(spottedBirdsList);
        outingDiv.appendChild(outingDate);
        outingDiv.appendChild(removeLink);

        pastOutingsList.appendChild(outingDiv);
      });
      // Save the updated outings back to local storage
      localStorage.setItem('outings', JSON.stringify(updatedOutings));
    });
  }
}

function lookupLocation(locationName) {
  return fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${locationName}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const locationData = data[0];
        return { lat: locationData.lat, lon: locationData.lon };
      } else {
        console.log(`No location found for ${locationName}`);
        return null;
      }
    })
    .catch(error => {
      console.log('Error:', error);
      return null;
    });
}




displayPastOutings();

