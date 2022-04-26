var _a;
const $ = (query) => document.querySelector(query);
parking().render();
function calcTime(date) {
    const min = Math.floor(date / 60000);
    const sec = Math.floor((date % 60000) / 1000);
    return { min, sec };
}
(_a = $("#sign-up")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    var _a, _b;
    const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
    const plate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
    if (!name || !plate) {
        alert(`Os campos "nome" e "placa" são obrigatórios!`);
        return;
    }
    if (parking().read().some(vehicle => vehicle.plate === plate)) {
        alert("Veiculo já adicionado!");
        return;
    }
    parking().add({ name, plate, date: new Date().toISOString() }, true);
});
function parking() {
    function read() {
        return localStorage.parking ? JSON.parse(localStorage.parking) : [];
    }
    function add(veiculo, saveItem) {
        var _a, _b;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${veiculo.name}</td>
            <td>${veiculo.plate}</td>
            <td>${veiculo.date}</td>
            <td>
                <button class="delete" data-plate="${veiculo.plate}">X</button>
            </td>
        `;
        (_a = $("#parking")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
        if (saveItem)
            save([...read(), veiculo]);
        (_b = row.querySelector(".delete")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
            remove(this.dataset.plate);
        });
    }
    function remove(plate) {
        const { date, name } = read().find(vehicle => vehicle.plate === plate);
        const { sec, min } = calcTime(new Date().getTime() - new Date(date).getTime());
        if (!confirm(`Permanencia do veiculo ${name} - ${plate} foi de ${min} minutos e ${sec} segundos, deseja encerrar?`))
            return;
        save(read().filter(vehicle => vehicle.plate !== plate));
        render();
        const priceValue = $("#price").value;
        const price = (priceValue ? (parseInt(priceValue) / 60 / 60 * sec) + (parseInt(priceValue) / 60) * min : 5 / 60 / 60 * sec + 5 / 60 * min).toFixed(2);
        alert(`Veiculo removido. Valor a receber: $${price}`);
    }
    function render() {
        $("#parking").innerHTML = "";
        const parking = read();
        if (parking.length) {
            parking.forEach(veiculo => {
                add(veiculo, false);
            });
        }
    }
    function save(veiculos) {
        localStorage.setItem("parking", JSON.stringify(veiculos));
    }
    return { read, add, remove, render, save };
}
