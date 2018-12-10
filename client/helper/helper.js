
const handleError = (message) => {
    alert(message);
}

const redirect = (response) => {
    $("#domoMessage").animate({width:'hide'},350);
    window.location = response.redirect;
}

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
}

const formatDate = (date) => {
    let tempDate = new Date(date);

    //tempDate = tempDate.toLocaleString('en-US', { timeZone: 'EST' });
    let tempMonth = tempDate.getMonth() + 1;
    let tempHours = tempDate.getHours();
    let amPM = '';
    if(tempHours > 12){ 
        amPM = 'PM';
        tempHours -= 12; 
    }
    else{
        amPM = 'AM';
    }
    let tempMin = tempDate.getMinutes();
    if(tempMin < 10) { tempMin = '0' + tempMin  };
    let tempYear = tempDate.getYear() + 1900;
    tempDate = tempMonth + '/' + tempDate.getDate() + '/' + tempYear + ' ' + tempHours + ':' + tempMin + amPM;

    return tempDate;
}