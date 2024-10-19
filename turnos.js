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
        2: [1, 2, 4, 7, 14],      // veterinario 2
        3: [0, 1, 7, 9, 11, 15],     // veterinario 3
        0: [0,1,2,3,4,5,6,7,9,10,11,14,15] // todos
    };

    // Si la opción no existe, usa la opción 4 por defecto
    const daysToAdd = daysConfig[option] || daysConfig[0];

    return daysToAdd.map(days => {
        const date = new Date(today);
        date.setDate(today.getDate() + days);
        return dateFormatter.format(date);
    });
};

function generateCalendar(date, veterinario=0) {
    // fechas habilitadas debería venir del backend
    let availableDates =  generarFechas(veterinario);
    console.log(availableDates+" son las fechas");
    console.log(veterinario+" es el "+veterinarioElegido);
    const firstDay = moment(date).startOf('month');
    const daysInMonth = moment(date).daysInMonth();
    const startingDay = firstDay.day();
    $('#currentMonth').text(moment(date).format('MMMM YYYY'));
    $('#calendar').empty();
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      $('#calendar').append('<div class="p-2 text-center text-gray-400"></div>');
    }
    
    // Add calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = moment(date).date(day).format('YYYY-MM-DD');
      const isAvailable = availableDates.includes(currentDate);
      
      const dayElement = $('<div>', {
        class: `p-2 text-center cursor-pointer rounded hover:bg-gray-100 ${
          isAvailable ? 'bg-blue-50 text-blue-600' : ''
        }`
      }).text(day);
      
      dayElement.click(function() {
        if (isAvailable) {
          $('.selected-date').removeClass('selected-date bg-blue-500 text-white');
          $(this).addClass('selected-date bg-blue-500 text-white');
          $('#scheduleDate').text(`Agenda para ${moment(currentDate).format('LL')}`);
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
            $('.veterinarios').hide();
            $('#nextStep').click();
            $('.navegacion').show();
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
        $('#nextStep').click();
        $('.navegacion').show();
    });

    $('#nextStep').click(function() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateSteps();
        }else{
            confirmarTurno();
        }
    });

    $('#prevStep').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Initialize steps
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

function confirmarTurno(){
    alert("Fin");
}
function updateSteps() {
    if(currentStep==1)
        $('.navegacion').hide();
    else
        $('.paso'+(currentStep-1)).hide("slide", { direction: "right" }, 500);
    $('div[class^="paso"],#nextStep').hide();

    $('.step').each(function(index) {
        const stepNumber = index + 1;
        const stepElement = $(this);
        const circle = stepElement.find('div:first');
        const text = stepElement.find('div:last');

        if (stepNumber < currentStep) {
            // Completed steps
            circle.removeClass('bg-gray-200 text-gray-600').addClass('bg-indigo-600 text-white');
            text.removeClass('text-gray-500').addClass('text-indigo-600');
            circle.html('<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>');
        } else if (stepNumber === currentStep) {
            // Current step
            circle.removeClass('bg-gray-200 text-gray-600').addClass('bg-indigo-600 text-white');
            text.removeClass('text-gray-500').addClass('text-indigo-600');
            circle.html(`<span class="text-sm font-medium">${String(stepNumber).padStart(2, '0')}</span>`);
        } else {
            // Future steps
            circle.removeClass('bg-indigo-600 text-white').addClass('bg-gray-200 text-gray-600');
            text.removeClass('text-indigo-600').addClass('text-gray-500');
            circle.html(`<span class="text-sm font-medium">${String(stepNumber).padStart(2, '0')}</span>`);
        }
    });

    if(currentStep==1)
        $('.paso'+currentStep).show();
    else
        $('.paso'+currentStep).show("slide", { direction: "right" }, 500);



    // Update button states
    $('#prevStep').prop('disabled', currentStep === 1);
    $('#nextStep').text(currentStep === totalSteps ? 'Finalizar' : 'Siguiente');
}