function change() {
    
    document.getElementById('demo').innerHTML = 'Hello JavaScript!'
}

function throwAlert()
{
    window.alert("You got it !!!");

}

function myFunction(){
   
    document.getElementById("frm1").reset();
}

function getOption() {
    var obj = document.getElementById("mySelect");
    document.getElementById("opt").innerHTML =
    obj.options[obj.selectedIndex].text;
}