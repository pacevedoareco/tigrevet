$(document).ready(function() {
	$("main").click(()=>{
		if($("#menuHamburguesa input").prop("checked"))
			$("#menuHamburguesa input").click();
	});
});