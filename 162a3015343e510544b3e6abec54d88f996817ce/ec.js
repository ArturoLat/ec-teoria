let preguntas;
let preguntaActualIndex = 0;
let preguntasRespondidas = [];
let correctas = 0;
let incorrectas = 0;
let totalPreguntas = 0;

fetch('PREGUNTAS.json')
  .then(response => response.json())
  .then(data => {
    preguntas = data.preguntes;
    //shuffle preguntas
    preguntas = preguntas.sort(() => Math.random() - 0.5);
    //eliminar preguntas que sean iguales su text
    preguntas = preguntas.filter((pregunta, index, self) =>
      index === self.findIndex((t) => (
        t.text === pregunta.text
      ))
    );
    totalPreguntas = preguntas.length;
    document.querySelector('h1').innerText += ` ${totalPreguntas} Vas por la pregunta ${preguntaActualIndex + 1}`;
    mostrarPregunta();
  });

function mostrarPregunta() {
  document.querySelector('h1').innerText = ` Pregunta ${preguntaActualIndex + 1} de ${totalPreguntas}`;
  if (preguntaActualIndex >= preguntas.length) {
    document.getElementById('pregunta').innerText = 'No hay más preguntas.';
    Swal.fire({
      title: '¡Has terminado!',
      text: `Has acertado ${correctas} preguntas y has fallado ${incorrectas}. Tu nota es de ${(correctas / totalPreguntas * 10).toFixed(2)}`,
       icon: correctas > incorrectas ? 'success' : 'error',
      confirmButtonText: 'Volver a jugar'
    }).then(() => {
      window.location.reload();
    });
    return;
  }

  let preguntaActual = preguntas[preguntaActualIndex];
  
  if (preguntasRespondidas.includes(preguntaActual.id)) {
    preguntaActualIndex++;
    mostrarPregunta();
    return;
  }

  document.getElementById('pregunta').innerText = preguntaActual.text;
  let opcionesDiv = document.getElementById('opciones');
  opcionesDiv.innerHTML = '';

  if (preguntaActual.type === 'multi') {
    // Convertir las respuestas a un array y barajarlo
    let respuestas = Object.entries(preguntaActual.respostes);
    mezclarArray(respuestas);

    respuestas.forEach(([key, value]) => {
      let boton = document.createElement('button');
      boton.innerText = value;
      boton.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-black', 'font-medium', 'py-2', 'px-4', 'rounded');
      boton.onclick = () => validarRespuesta(key);
      opcionesDiv.appendChild(boton);
    });
  } else if (preguntaActual.type === 'text') {
    let input = document.createElement('input');
    let boton = document.createElement('button');
    input.type = 'text';
    input.classList.add('border', 'border-gray-300', 'rounded', 'py-2', 'px-4');
    boton.innerText = 'Validar';
    boton.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-black', 'font-medium', 'py-2', 'px-4', 'rounded');
    boton.onclick = () => validarRespuesta(input.value);
    opcionesDiv.appendChild(input);
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        validarRespuesta(input.value);
      }
    });
    opcionesDiv.appendChild(boton);
  }
}

// Función para mezclar un array (Algoritmo de Fisher-Yates)
function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function validarRespuesta(respuestaUsuario) {
  let preguntaActual = preguntas[preguntaActualIndex];
  preguntasRespondidas.push(preguntaActual.id);
  let esCorrecta = preguntaActual.correcta === respuestaUsuario;

  if (esCorrecta) {
    // Si la respuesta es correcta, muestra una alerta con SweetAlert
    Swal.fire({
      title: '¡Correcto!',
      text: 'Tu respuesta es correcta.',
      icon: 'success',
      confirmButtonText: 'Siguiente pregunta'
    }).then(() => {
      correctas++;
      preguntaActualIndex++;
      mostrarPregunta();
    });
  } else {
    // Si la respuesta es incorrecta, muestra una alerta con SweetAlert
    let respuestaCorrecta;
    switch (preguntaActual.correcta) {
      case 'a':
        respuestaCorrecta = preguntaActual.respostes.a;
        break;
      case 'b':
        respuestaCorrecta = preguntaActual.respostes.b;
        break;
      case 'c':
        respuestaCorrecta = preguntaActual.respostes.c;
        break;
      default:
        respuestaCorrecta = '';
    }
    Swal.fire({
      title: 'Incorrecto',
      text: `La respuesta correcta era: ${respuestaCorrecta}`,
      icon: 'error',
      confirmButtonText: 'Siguiente pregunta'
    }).then(() => {
      incorrectas++;
      preguntaActualIndex++;
      mostrarPregunta();
    });
  }
  
}