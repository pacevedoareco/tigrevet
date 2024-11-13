// variables para panel de pasos
let currentStep = 1;
const totalSteps = 4;
let veterinarioElegido = 0;

const generarFechas = (option = 0) => {
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const today = new Date();
    
    // Diferentes configuraciones de días según la opción
    const daysConfig = {
        1: [0, 3, 5, 6, 10],      // veterinario 1
        2: [0, 1, 2, 4, 7, 14],      // veterinario 2
        3: [0, 1, 7, 9, 11, 15],     // veterinario 3
        0: [0,1,2,3,4,5,6,7,9,10,11,14,15] // todos
    };

    // Si la opción no existe, usa la opción 0 por defecto
    const daysToAdd = daysConfig[option] || daysConfig[0];

    return daysToAdd.map(days => {
        const date = new Date(today);
        date.setDate(today.getDate() + days);
        return dateFormatter.format(date);
    });
};

const generateMonthlySchedules = () => {
    // Función auxiliar para generar horarios
    const formatTime = (hour, minutes) => {
        return `${hour}${minutes === 30 ? ':30' : ''}`;
    };
    // Genera todos los posibles intervalos de 30 minutos entre 9:00 y 18:00
    const generateAllPossibleSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 18; hour++) {
            slots.push(`${formatTime(hour, 0)} - ${formatTime(hour, 30)}hs`);
            slots.push(`${formatTime(hour, 30)} - ${formatTime(hour + 1, 0)}hs`);
        }
        return slots;
    };

    // Función para obtener elementos aleatorios de un array
    const getRandomSlots = (array, min, max) => {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).sort((a, b) => {
            const timeA = parseInt(a.split('-')[0]);
            const timeB = parseInt(b.split('-')[0]);
            return timeA - timeB;
        });
    };

    const allPossibleSlots = generateAllPossibleSlots();
    const horarios = {};

    // Genera horarios para cada día del mes
    for (let day = 1; day <= 31; day++) {
        horarios[day] = getRandomSlots(allPossibleSlots, 3, 5);
    }
    return horarios;
};

function generateCalendar(date, veterinario=0) {
    // fechas habilitadas debería venir del backend
    let availableDates =  generarFechas(veterinario);
    const horariosMes = generateMonthlySchedules();
    //console.log(availableDates+" son las fechas");
    const firstDay = moment(date).startOf('month');
    const daysInMonth = moment(date).daysInMonth();
    const startingDay = firstDay.day();
    $('#currentMonth').text(moment(date).format('MMMM YYYY'));
    $('#calendar').empty();
    $("#agendaDia").empty();
    
    // Agregar espacios vacios antes del 1ro del mes
    for (let i = 0; i < startingDay; i++) {
      $('#calendar').append('<div class="p-2 text-center text-gray-400"></div>');
    }
    
    // Agregar cada dia del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = moment(date).date(day).format('YYYY-MM-DD');
      const isAvailable = availableDates.includes(currentDate);
      
      const dayElement = $('<div>', {
        class: `p-2 text-center cursor-pointer rounded hover:bg-gray-100 ${
          isAvailable ? 'bg-blue-50 text-blue-600 habilitado' : ''
        }`
      }).text(day);
      
      dayElement.click(function() {
        if (isAvailable) {
          $('.selected-date').removeClass('selected-date bg-blue-500 text-white');
          $(this).addClass('selected-date bg-blue-500 text-white');
          $('#scheduleDate').text(`Agenda para ${moment(currentDate).format('LL')}`);
          $("#agendaDia").html("");
          for(let i=0;i<horariosMes[day].length;i++){
            let nombre;
            let fotoVeterinario;
            let tuVeterinario = parseInt($('.veterinarioElegido').text());
            if(tuVeterinario==0 || tuVeterinario > 3)
                tuVeterinario = Math.floor(Math.random()*3)+1;
            console.log("un vete"+tuVeterinario+".");
            switch(tuVeterinario){
            case 1:
                fotoVeterinario = "pablo.jpg";
                nombre = "Pablo";
                break;
            case 2:
                fotoVeterinario = "nacho.jpg";
                nombre = "Nacho";
                break;
            case 3:
                fotoVeterinario = "nahuel.jpg";
                nombre = "Nahuel";
                break;
            }
          $("#agendaDia").append("<div id='horario"+i+"' class='horario flex items-center justify-between justify-self-center p-5 text-gray-500 bg-white border border-gray-200 rounded cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'><img src='./img/"+fotoVeterinario+"' class='w-12 h-12 rounded-full'><div><h3 class='font-medium'>"+nombre+"</h3><p class='text-gray-600'>"+horariosMes[day][i]+"</p></div>");
          $("#horario"+i).click(function(){
            $('#nextStep').click();
            $('.paso3vet,#teAtiendeNombre').text($(this).find("h3").text());
            $('#teAtiendeFoto').attr('src','./img/'+$('.paso3vet').text().toLowerCase()+'.jpg');
            $('.navegacion,#nextStep,.paso3').removeClass('hidden');
          });
          }
        }
      });
      
      $('#calendar').append(dayElement);

      if(day==moment().date())
        dayElement.click();  
    }
}

$(document).ready(function() {
    $("main").click(()=>{
        if($("#menuHamburguesa input").prop("checked"))
            $("#menuHamburguesa input").click();
    });
    $('.veterinarios li').each(function(index){
        $(this).on("click", function(){
            let elID = $(this).attr('id');
            veterinarioElegido = elID.charAt(elID.length-1);
              moment.locale('es');
            let currentDate = moment();
            generateCalendar(currentDate, veterinarioElegido);
            $('.veterinarioElegido').html(veterinarioElegido);
            $("#agendaDia").empty();
            $('.veterinarios').hide();
            $('#nextStep').click();
            $('.navegacion').removeClass('hidden');
        });
    });
    $('.porVeterinario').click(function(){
        $('.paso1').hide();
        $('.veterinarios').fadeIn();
    });
    $('.porFecha').click(function(){
        moment.locale('es');
        let currentDate = moment();
        generateCalendar(currentDate);
        $('.veterinarioElegido').html("0");
        $('#nextStep').click();
        $('.navegacion').removeClass('hidden');
    });

    $('#nextStep').click(function() {
        let errores = 0;
        if (currentStep == (totalSteps-1)) //ultimo paso
            errores = revisarForm();
        if (errores < 1){   // no hay errores o no es el ultimo paso
            currentStep++;
            updateSteps();
        }
        if (errores == -1)  // ultimo paso sin errores
            confirmarTurno();
        if (errores == 2)
            $("#erroresForm").removeClass('hidden');
        if (errores == 3){
            $(".msjError").html("Revisá que el mail sea correcto.");
            $("#erroresForm").removeClass('hidden');
        } else {
            $(".msjError").html("Por favor, completá todos tus datos para poder confirmar el turno.");
        }
        console.log("errores? "+errores);
    });

    $('#prevStep').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    updateSteps();

    moment.locale('es');
    let currentDate = moment();
    generateCalendar(currentDate, veterinarioElegido);

    $('#prevMonth').click(function() {
    currentDate = moment(currentDate).subtract(1, 'month');
    generateCalendar(currentDate, veterinarioElegido);
    });

    $('#nextMonth').click(function() {
    currentDate = moment(currentDate).add(1, 'month');
    generateCalendar(currentDate, veterinarioElegido);
    });
});

function revisarForm(){
    var hayError = -1;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test($("#email").val())) hayError = 3;
    $("#nombre,#email,#telefono").each(function(index){
        if($(this).val()=="") return hayError = 2;
    });
    return hayError;
}
function confirmarTurno(){
    $('.navegacion').addClass('hidden');
    $(".pasoFinal").fadeIn();
}
function updateSteps() {
    if(currentStep==1)
        $('.navegacion').addClass('hidden');
    else
        $('.paso'+(currentStep-1)).hide();
    $('div[class^="paso"]').hide();
    $('#nextStep').addClass('hidden');

    $('.step').each(function(index) {
        const stepNumber = index + 1;
        const stepElement = $(this);
        const circle = stepElement.find('div:first');
        const text = stepElement.find('div:last');

        if (stepNumber < currentStep) {
            // Pasos completos
            circle.removeClass('bg-gray-200 text-gray-600').addClass('bg-indigo-600 text-white');
            text.removeClass('text-gray-500').addClass('text-indigo-600');
            circle.html('<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>');
        } else if (stepNumber === currentStep) {
            // Paso actual
            circle.removeClass('bg-gray-200 text-gray-600').addClass('bg-indigo-600 text-white');
            text.removeClass('text-gray-500').addClass('text-indigo-600');
            circle.html(`<span class="text-sm font-medium">${String(stepNumber).padStart(2, '0')}</span>`);
        } else {
            // Pasos futuros
            circle.removeClass('bg-indigo-600 text-white').addClass('bg-gray-200 text-gray-600');
            text.removeClass('text-indigo-600').addClass('text-gray-500');
            circle.html(`<span class="text-sm font-medium">${String(stepNumber).padStart(2, '0')}</span>`);
        }
    });

    if(currentStep==1)
        $('.paso'+currentStep).show();
    else
        $('.paso'+currentStep).show("slide", { direction: "right" }, 300);

    // Actualizo botones
    $('#prevStep').prop('disabled', currentStep === 1);
    $('#nextStep').text(currentStep === totalSteps ? 'Finalizar' : 'Siguiente');
}