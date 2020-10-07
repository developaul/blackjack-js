// Referencias
const btnPedir          = document.querySelector('#btnPedir'),
    btnNuevo            = document.querySelector('#btnNuevo'),
    btnDetener          = document.querySelector('#btnDetener'),
    puntosHTML          = document.querySelectorAll('small'),
    divCartasJugadores  = document.querySelectorAll('.div-cartas');

// Variables
let deck            = [],
    puntosJugadores = [];

const tipos     = ['C', 'D', 'H', 'S'],
    especiales  = ['A', 'J', 'Q', 'K'];


// FUNCIONES
// Esta función inicializa el juego
export const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++)
        puntosJugadores.push(0);

    for (let jugador in puntosJugadores) {
        puntosHTML[jugador].textContent = 0;
        divCartasJugadores[jugador].textContent = '';
    }
    activarBotones();
}

// Esta función crea una nueva baraja
const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos)
            deck.push(i + tipo);
    }

    for (let tipo of tipos) {
        for (let especial of especiales)
            deck.push(especial + tipo);
    }
    return _.shuffle(deck);
}

// Esta función me permite tomar una carta
const pedirCarta = () => {
    if (deck.length <= 0) throw 'No hay cartas en el deck';
    return deck.pop();
}

// Esta función devuelve el valor de la carta
const valorCarta = carta => {
    const valor = carta.substring(0, carta.length - 1);
    return (isNaN(valor)) ?
        (valor === 'A') ? 11 : 10
        : valor * 1;
}

// Esta función determina el ganador
const determinarGanador = ([puntosJugador, puntosComputadora]) => {
    setTimeout(() => {
        if (puntosJugador <= 21) {

            if (puntosComputadora <= 21) {

                if (puntosJugador === puntosComputadora) {
                    alert('Nadie gana :(');
                } else if (puntosJugador > puntosComputadora) {
                    alert('Jugador gana!');
                } else {
                    alert('Computadora gana!');
                }

            } else {
                alert('Jugador gana!');
            }

        } else {
            alert('Computadora gana!');
        }
    }, 400);
}

// Esta función Acumula los puntos de los jugadores
const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] += valorCarta(carta);
    puntosHTML[turno].textContent = puntosJugadores[turno];
    return puntosJugadores[turno];
}

// Esta función crea la carta en el HTML
const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/${carta}.png`;
    imgCarta.classList.add('carta');
    divCartasJugadores[turno].append(imgCarta);
}

// Esta función ejecuta el turno de la computadora
const turnoComputadora = puntosMinimos => {
    let puntosComputadora = 0;

    do {
        const carta = pedirCarta(deck);
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCarta(carta, puntosJugadores.length - 1);
    } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

    determinarGanador(puntosJugadores);
}

// Esta función desactiva los botones pedir y detener
const desactivarBotones = () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
}

// Esta función activa los botones pedir y detener
const activarBotones = () => {
    btnPedir.disabled = false;
    btnDetener.disabled = false;
}


// EVENTOS
// Este evento le da una carta al jugador
btnPedir.addEventListener('click', () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);
    crearCarta(carta, 0);

    if (puntosJugador > 21) {
        console.warn('Lo siento mucho, perdiste');
        desactivarBotones();
        turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
        console.warn('21, genial!');
        desactivarBotones();
        turnoComputadora(puntosJugador);
    }
});

// Este evento detiene el turno del jugador
btnDetener.addEventListener('click', () => {
    desactivarBotones();
    turnoComputadora(puntosJugadores[0]);
});

// Este evento reinicia el juego
btnNuevo.addEventListener('click', () => {
    inicializarJuego();
});