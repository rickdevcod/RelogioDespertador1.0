const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./notification2030.mp3");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// Função auxiliar para adicionar um zero à esquerda para valores de um dígito
const adicionarZero = (valor) => (valor < 10 ? "0" + valor : valor);

// Função para exibir o horário e acionar alarmes
const exibirRelogio = () => {
    const data = new Date();
    const horaAtual = data.toLocaleTimeString("pt-BR", { hour12: false });
    timerRef.textContent = horaAtual;

    // Verifique se é hora de acionar os alarmes
    alarmsArray.forEach((alarme) => {
        if (alarme.ativo && alarme.hora === horaAtual.slice(0, 5)) {
            alarmSound.play();
        }
    });
};

// Função para criar um novo alarme
const criarAlarme = (hora, minuto) => {
    alarmIndex += 1;

    // Crie um objeto de alarme
    const objetoAlarme = {
        id: `${alarmIndex}_${hora}_${minuto}`,
        hora: `${adicionarZero(hora)}:${adicionarZero(minuto)}`,
        ativo: false
    };

    // Adicione o alarme ao array e crie sua representação na interface do usuário
    alarmsArray.push(objetoAlarme);
    const divAlarme = document.createElement("div");
    divAlarme.className = "alarme";
    divAlarme.dataset.id = objetoAlarme.id;
    divAlarme.innerHTML = `<span>${objetoAlarme.hora}</span>`;

    // Crie uma caixa de seleção para ativar/desativar o alarme
    const caixaSelecao = document.createElement("input");
    caixaSelecao.type = "checkbox";
    caixaSelecao.addEventListener("change", () => alternarAlarme(objetoAlarme));
    divAlarme.appendChild(caixaSelecao);

    // Crie um botão de exclusão para o alarme
    const botaoExcluir = document.createElement("button");
    // Font awesome
    botaoExcluir.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    botaoExcluir.className = "botaoExcluir";
    botaoExcluir.addEventListener("click", () => excluirAlarme(objetoAlarme));
    divAlarme.appendChild(botaoExcluir);

    // Adicione o alarme na lista de alarmes ativos
    activeAlarms.appendChild(divAlarme);
};

// Função para alternar o estado ativo do alarme
const alternarAlarme = (alarme) => {
    alarme.ativo = !alarme.ativo;
    if (alarme.ativo) {
        const horaAtual = new Date().toLocaleTimeString("pt-BR", { hour12: false }).slice(0, 5);
        if (alarme.hora === horaAtual) {
            alarmSound.play();
        }
    } else {
        alarmSound.pause();
    }
};

// Função para excluir um alarme
const excluirAlarme = (alarme) => {
    const indice = alarmsArray.indexOf(alarme);
    if (indice > -1) {
        alarmsArray.splice(indice, 1);
        document.querySelector(`[data-id="${alarme.id}"]`).remove();
    }
};

// Evento de escuta para limpar todos os alarmes
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Evento de escuta para configurar um novo alarme
setAlarm.addEventListener("click", () => {
    // Analisar os valores de entrada, com valor padrão de 0 se estiverem vazios ou não forem números
    let hora = parseInt(hourInput.value) || 0;
    let minuto = parseInt(minuteInput.value) || 0;

    // Valide os valores de entrada
    if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
        alert("Hora ou minuto inválido. Por favor, insira valores dentro da faixa válida!");
        return;
    }

    // Verifique se um alarme com o mesmo horário já existe
    if (!alarmsArray.some(alarme => alarme.hora === `${adicionarZero(hora)}:${adicionarZero(minuto)}`)) {
        criarAlarme(hora, minuto);
    }

    // Limpe os campos de entrada
    [hourInput.value, minuteInput.value] = ["", ""];
});

// Inicialize o relógio e os campos de entrada
window.onload = () => {
    setInterval(exibirRelogio, 1000);
    [hourInput.value, minuteInput.value] = ["", ""];
}
