function getPlanetInfo(planetName) {
  fetch("planetData.json")
    .then(res => res.json())
    .then(data => {
      const planet = data.find(obj => obj.name.toLowerCase() === planetName.toLowerCase());
      if (planet) {
        console.log(`--- ${planet.name} ---`);
        console.log("Type:", planet.type);
        console.log("Age:", planet.age);
        console.log("History:", planet.history);
        console.log("Characteristics:", planet.characteristics);
        console.log("Moons:", planet.moons.length > 0 ? planet.moons.join(", ") : "None");
      } else {
        console.log("Planet not found.");
      }
    })
    .catch(err => console.error(err));
}

// Example usage:
getPlanetInfo("Earth");
getPlanetInfo("Jupiter");
getPlanetInfo("Neptune");