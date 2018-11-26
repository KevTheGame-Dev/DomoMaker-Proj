"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
        handleError("Aaah! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
        $("#domoName").val('');
        $("#domoAge").val('');
        $("#domoLevel").val('');
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "level" },
            "Level: "
        ),
        React.createElement("input", { id: "domoLevel", type: "text", name: "level", placeholder: "Domo Level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet!"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoLevel" },
                "Level: ",
                domo.level,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        React.createElement(
            "div",
            { id: "domoHeader" },
            " ",
            React.createElement(
                "h2",
                null,
                "Domos"
            ),
            " "
        ),
        React.createElement(
            "div",
            { id: "domoSortDiv" },
            React.createElement(
                "label",
                { htmlFor: "sort" },
                "Sort: "
            ),
            React.createElement(
                "select",
                { id: "sortSelector", name: "sort" },
                React.createElement(
                    "option",
                    { value: "Name_AZ" },
                    "Name: A -> Z"
                ),
                React.createElement(
                    "option",
                    { value: "Name_ZA" },
                    "Name: Z -> A"
                ),
                React.createElement(
                    "option",
                    { value: "Age_A" },
                    "Age: Ascending"
                ),
                React.createElement(
                    "option",
                    { value: "Age_D" },
                    "Age: Descending"
                ),
                React.createElement(
                    "option",
                    { value: "Level_A" },
                    "Level: Ascending"
                ),
                React.createElement(
                    "option",
                    { value: "Level_D" },
                    "Level: Descending"
                )
            )
        ),
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        var domoList = data.domos;
        domoList = sortList($("#sortSelector").val(), domoList);

        ReactDOM.render(React.createElement(DomoList, { domos: domoList }), document.querySelector("#domos"));

        //Add an onChange listener to the sort selector
        $("#sortSelector").change(function () {
            //Sort list based on selector
            domoList = sortList($("#sortSelector").val(), domoList);

            //Re-render Domolist after sorting
            ReactDOM.render(React.createElement(DomoList, { domos: domoList }), document.querySelector("#domos"));
        });
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

//Sort helper function
var sortList = function sortList(sortType, domoList) {
    switch (sortType) {
        case "Name_AZ":
            //Sort A -> Z
            domoList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            break;
        case "Name_ZA":
            //Sort Z -> A
            domoList.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });
            break;
        case "Age_A":
            //Sort age ascending
            domoList.sort(function (a, b) {
                return a.age - b.age;
            });
            break;
        case "Age_D":
            //Sort age descending
            domoList.sort(function (a, b) {
                return b.age - a.age;
            });
            break;
        case "Level_A":
            //Sort level ascending
            domoList.sort(function (a, b) {
                return a.level - b.level;
            });
            break;
        case "Level_D":
            //Sort level descending
            domoList.sort(function (a, b) {
                return b.level - a.level;
            });
            break;
        default:
            //Default to sorting A -> Z
            domoList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            break;
    }

    return domoList;
};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
