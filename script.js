$(document).ready(function() {
	$( "#calendario" ).datepicker();

	$("main").click(()=>{
		if($("#menuHamburguesa input").prop("checked"))
			$("#menuHamburguesa input").click();
	});
});
