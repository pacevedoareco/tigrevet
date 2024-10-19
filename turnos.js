// esto debería venir del backend
const fechasHabilitadasVet1 = ["25/10/2024", "26/10/2024", "27/10/2024", "30/10/2024"];
const fechasHabilitadasVet2 = ["25/10/2024", "26/10/2024", "27/10/2024", "30/10/2024"];
const fechasHabilitadasVet3 = ["25/10/2024", "26/10/2024", "27/10/2024", "30/10/2024"];
const availableDates = ['2024-10-21', '2024-10-19', '2024-10-28'];

let currentStep = 1;
const totalSteps = 4;

function generateCalendar(date) {
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
          $('#scheduleDate').text(`Agenda para ${moment(currentDate).format('MMMM D, YYYY')}`);
        }
      });
      
      $('#calendar').append(dayElement);
    }
}

$(document).ready(function() {
    $("main").click(()=>{
        if($("#menuHamburguesa input").prop("checked"))
            $("#menuHamburguesa input").click();
    });

    $('.porVeterinario').click(function(){
        $('#nextStep').click();
        $('.navegacion').show();
    });
    $('.porFecha').click(function(){
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
  generateCalendar(currentDate);
  
  $('#prevMonth').click(function() {
    currentDate = moment(currentDate).subtract(1, 'month');
    generateCalendar(currentDate);
  });
  
  $('#nextMonth').click(function() {
    currentDate = moment(currentDate).add(1, 'month');
    generateCalendar(currentDate);
  });
});

function confirmarTurno(){
    alert("Fin");
}
function updateSteps() {
    $('div[class^="paso"]').hide();
    if(currentStep==1)
        $('.navegacion').hide();
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

    $('.paso'+currentStep).show();

    // Update button states
    $('#prevStep').prop('disabled', currentStep === 1);
    $('#nextStep').text(currentStep === totalSteps ? 'Finalizar' : 'Siguiente');
}