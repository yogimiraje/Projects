/**
 * New node file
 */
function HandleFileButtonClick(){
 
    document.frmUpload.myFile.click();
    document.frmUpload.txtFakeText.value = document.frmUpload.myFile.value;
}