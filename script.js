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

    birdButton.addEventListener('click', () => toggleBirdSpotting(bird));
    birdList.appendChild(birdButton);
  });
}



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
}

populateBirdList();

document.querySelectorAll('.nav-item').forEach((navItem) => {
  navItem.addEventListener('click', (event) => {
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.view').forEach((view) => view.style.display = 'none');
    document.getElementById(event.currentTarget.dataset.view).style.display = 'block';

    // Call displayPastOutings() when the "Past Outings" nav item is clicked
    if (event.currentTarget.dataset.view === 'past-outings') {
      displayPastOutings();
    }
  });
});


document.getElementById('save-outing').addEventListener('click', () => {
  const locationInput = document.getElementById('location');
  const notesInput = document.getElementById('notes');
  const date = new Date().toISOString();

  const outing = {
    location: locationInput.value,
    notes: notesInput.value,
    spottedBirds: spottedBirds,
    totalPoints: totalPoints,
    date,
  };

  const outings = JSON.parse(localStorage.getItem('outings') || '[]');
  outings.push(outing);
  localStorage.setItem('outings', JSON.stringify(outings));

  // Clear the inputs and spotted birds list after saving
  locationInput.value = '';
  notesInput.value = '';
  spottedBirds = [];
  totalPoints = 0;
  document.getElementById('total-points').textContent = totalPoints;
  document.querySelectorAll('.bird-button').forEach((button) => button.classList.remove('spotted'));

  // Show a confirmation message
  alert('Outing saved successfully!');
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


function displayPastOutings() {
  const pastOutingsList = document.getElementById('past-outings-list');
  const outings = JSON.parse(localStorage.getItem('outings') || '[]');
  pastOutingsList.innerHTML = '';

  // Sort outings by most recent date
  outings.sort((a, b) => new Date(b.date) - new Date(a.date));

  outings.forEach((outing, index) => {
    const outingDiv = document.createElement('div');
    outingDiv.classList.add('past-outing');

    const outingTitle = document.createElement('h3');
    outingTitle.textContent = `${outing.location}`;

    const outingDate = document.createElement('p');
    const date = new Date(outing.date).toLocaleDateString();
    outingDate.innerHTML = `${date}`;

    const spottedBirdsList = document.createElement('ul');
    outing.spottedBirds.forEach((bird) => {
      const spottedBird = document.createElement('li');
      spottedBird.textContent = `${bird.name} (${bird.points} points)`;
      spottedBirdsList.appendChild(spottedBird);
    });



    const outingInfo = document.createElement('p');
    outingInfo.innerHTML = `Total Points: ${outing.totalPoints}<br>Notes: ${outing.notes}`;

    const removeLink = document.createElement('a');
    removeLink.href = 'javascript:void(0)';
    removeLink.textContent = 'REMOVE';
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
    outingDiv.appendChild(outingDate);
    outingDiv.appendChild(outingInfo);
    outingDiv.appendChild(spottedBirdsList);
    outingDiv.appendChild(removeLink);

    pastOutingsList.appendChild(outingDiv);
  });
}


displayPastOutings();

