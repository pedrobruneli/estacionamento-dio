interface IVeiculo {
    name: string;
    plate: string;
    date: Date | string;
}
const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

parking().render();

function calcTime(date: number) {
    const min = Math.floor(date / 60000);
    const sec = Math.floor((date % 60000) / 1000);
    return { min, sec };
}

$("#sign-up")?.addEventListener("click", () => {
    const name = $("#name")?.value;
    const plate = $("#plate")?.value;
    if (!name || !plate) {
        alert(`Os campos "nome" e "placa" são obrigatórios!`);
        return;
    }
    if (parking().read().some(vehicle => vehicle.plate === plate)) {
        alert("Veiculo já adicionado!");
        return;
    }
    parking().add({ name, plate, date: new Date().toISOString() }, true)

})

function parking() {
    function read(): IVeiculo[] {
        return localStorage.parking ? JSON.parse(localStorage.parking) : [];
    }

    function add(veiculo: IVeiculo, saveItem: boolean) {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${veiculo.name}</td>
            <td>${veiculo.plate}</td>
            <td>${veiculo.date}</td>
            <td>
                <button class="delete" data-plate="${veiculo.plate}">X</button>
            </td>
        `;
        $("#parking")?.appendChild(row);
        if (saveItem) save([...read(), veiculo]);
        row.querySelector(".delete")?.addEventListener("click", function () {
            remove(this.dataset.plate);
        })
    }

    function remove(plate: string) {
        const { date, name } = read().find(vehicle => vehicle.plate === plate);
        const { sec, min } = calcTime(new Date().getTime() - new Date(date).getTime());
        if (!confirm(`Permanencia do veiculo ${name} - ${plate} foi de ${min} minutos e ${sec} segundos, deseja encerrar?`)) return;

        save(read().filter(vehicle => vehicle.plate !== plate));
        render();
        const priceValue = $("#price").value;
        const price = (priceValue ? (parseInt(priceValue)/60/60 * sec) + (parseInt(priceValue)/60) * min : 5/60/60 * sec + 5/60*min).toFixed(2);
            alert(`Veiculo removido. Valor a receber: $${price}`)
    }

    function render() {
        $("#parking")!.innerHTML = "";
        const parking = read();

        if (parking.length) {
            parking.forEach(veiculo => {
                add(veiculo, false)
            });
        }
    }

    function save(veiculos: IVeiculo[]) {
        localStorage.setItem("parking", JSON.stringify(veiculos));
    }

    return { read, add, remove, render, save };
}