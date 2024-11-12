// variables para panel de pasos
let currentStep = 1;
const totalSteps = 4;

$(document).ready(function() {
    $("main").click(()=>{
        if($("#menuHamburguesa input").prop("checked"))
            $("#menuHamburguesa input").click();
    });
    $('.paso1opcionX').click(function(){
        let servID = $(this).attr('id');
        $('.servicioElegido').html(servID.charAt(servID.length-1));
        cargarPaso2($('.servicioElegido').html());
        $('#nextStep').click();
    });
    $('.paso2opcionX').click(function(){
        let servID = $(this).attr('id');
        $('.servicioElegido').append(servID.charAt(servID.length-1));
        cargarPaso3();
        $('#nextStep').click();
    });
    $('#nextStep').click(function() {
        if (currentStep == (totalSteps-1)) //ultimo paso
            calcularCosto();
        currentStep++;
        updateSteps();
    });
    $('#prevStep').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });
    updateSteps();
});
function calcularCosto(){
    $('.navegacion').addClass('hidden');
    $(".pasoFinal").fadeIn();
}
function updateSteps() {
    $('#nextStep').addClass('hidden');
    $('.navegacion').removeClass('hidden');
    $('div[class^="paso"]').hide();
    switch(currentStep){
    case 1:
        $('.navegacion').addClass('hidden');
        $('.paso'+currentStep).show();
        break;
    case 3:
        $('.paso'+currentStep).show("slide", { direction: "right" }, 200);
        $('#nextStep').removeClass('hidden');
        break;
    default:
        $('.paso'+currentStep).show("slide", { direction: "right" }, 200);
    }
    // Actualizo botones
    $('#prevStep').prop('disabled', currentStep === 1);
    $('#nextStep').text(currentStep === totalSteps-1 ? 'Calcular costo' : 'Siguiente');

    // Actualizo barra de pasos
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
}
function cargarPaso2(servicioElegido=0){
    switch(parseInt(servicioElegido)){
    case 1:
        $("#paso2opcion1 div div").html("Primer consulta");
        $("#paso2opcion2 div div").html("Chequeo general");
        $("#paso2opcion3 div div").html("Vacunación");
        $("#paso2opcion4").hide();
        break;
    case 2:
        $("#paso2opcion1 div div").html("Cirugía oftalmológica, oncológica");
        $("#paso2opcion2 div div").html("Cirugía gástrica, respiratoria o bucal");
        $("#paso2opcion3 div div").html("Castración o cirugía urológica");
        $("#paso2opcion4 div div").html("Traumatología");
        break;
    case 3:
        $("#paso2opcion1 div div").html("Endoscopía (con toma de muestra)");
        $("#paso2opcion2 div div").html("Radiografía");
        $("#paso2opcion3 div div").html("Ecografía");
        $("#paso2opcion4 div div").html("Rinoscopía");
        break;
    case 4:
        $("#paso2opcion1 div div").html("Limpieza bucal");
        $("#paso2opcion2 div div").html("Extracción (por pieza)");
        $("#paso2opcion3 div div").html("Glándula salival");
        $("#paso2opcion4").hide();
        break;
    case 5:
        $("#paso2opcion1 div div").html("Baño completo");
        $("#paso2opcion2 div div").html("Corte de pelo");
        $("#paso2opcion3 div div").html("Pelo y uñas");
        $("#paso2opcion4").hide();
        break;
    case 6:
        $("#paso2opcion1 div div").html("Raspado cutáneo");
        $("#paso2opcion2 div div").html("Hemograma");
        $("#paso2opcion3 div div").html("Análisis de orina");
        $("#paso2opcion4 div div").html("Análisis de heces"); 
        break;
    default:
        $(".detallesServicio").append(`Volvé a intentarlo (error: SE${servicioElegido}).`);
    }
}
function cargarPaso3(){
    let veteFoto = Math.random() >= 0.5 ? "Franco" : "Luciano";
    $('#teAtiendeFoto').attr('src','./img/'+veteFoto.toLowerCase()+'.jpg');
    $('#teAtiendeNombre').html(veteFoto);
    $('#nextStep').removeClass('hidden');
}