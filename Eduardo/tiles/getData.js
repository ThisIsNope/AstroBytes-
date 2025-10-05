let src = 'planetData.json';

fetch(src)
    .then(dat => dat.json())
    .then(data => {
        function getPlanetDATA(name) {
            for (let y of data) {
                if (y.name === name) {
                    let type = y.type;
                    let age = y.age;
                    let comp = y.characteristics.composition;
                    let diam = y.characteristics.diameter;
                    let surfTemp = y.characteristics.surface_temperature || "No data";
                    let coreTemp = y.characteristics.core_temperature || "No data";
                    let descTitle = y.history.formation.era;
                    let desc = y.history.formation.description;
                    let moons = "";

                    if (y.moons && y.moons.length > 0) {
                        for (let m of y.moons) {
                            moons += "- " + m + "\n";
                        }
                    } else {
                        moons = "NA";
                    }

                    return (
                        `Nombre: ${y.name}\n` +
                        `Tipo: ${type}\n` +
                        `Edad: ${age}\n` +
                        `Composición: ${comp}\n` +
                        `Diámetro: ${diam}\n` +
                        `Temperatura superficial: ${surfTemp}\n` +
                        `Temperatura del núcleo: ${coreTemp}\n` +
                        `Era de formación: ${descTitle}\n` +
                        `Descripción: ${desc}\n` +
                        `Lunas:\n${moons}`
                    );
                }
            }
            // Si no lo encuentra:
            return "Planeta no encontrado.";
        }

        // 💬 Ejemplo de uso:
        
    });
console.log(getPlanetDATA("Mercury"));