const fs = require("fs");

const crearSerie = (veces) => {
    return new Promise((resolve, reject) => {
        let fibo1 = 1;
        let fibo2 = 1;
        let serie = "";

        serie += `${fibo1}\n`;

        for (let i = 2; i <= veces; i++) {
            serie += `${fibo2}\n`;
            fibo2 = fibo1 + fibo2;
            fibo1 = fibo2 - fibo1;
        }

        fs.writeFile("Fibonacci.txt", serie, (err) => {
            if (err) reject("Error al crear el archivo");
            else resolve("El archivo fue creado con exito");
        });
    });
};

module.exports = {
    crearSerie,
};
