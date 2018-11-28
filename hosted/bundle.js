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
        //$("#domoName").val('');
        //$("#domoAge").val('');
        //$("#domoLevel").val('');
    });

    return false;
};

var handleTask = function handleTask(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#taskName").val() == '' || $("#taskStart").val() == '' || $("#taskEnd").val() == '') {
        handleError("Aaah! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        loadTasksFromServer();
        $("#taskName").val('');
        $("#taskStart").val('');
        $("#taskEnd").val('');
        $("#taskDescription").val('');
        //Add subtask reset here
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

var TaskForm = function TaskForm(props) {
    //TO-DO ADD SUBTASK SELECTOR
    return React.createElement(
        "form",
        { id: "taskForm",
            onSubmit: handleTask,
            name: "taskForm",
            action: "/maker",
            method: "POST",
            className: "taskForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name", required: true }),
        React.createElement(
            "label",
            { htmlFor: "startDate" },
            "Start Date: "
        ),
        React.createElement("input", { id: "taskStart", type: "date", name: "startDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}", required: true }),
        React.createElement(
            "label",
            { htmlFor: "endDate" },
            "End Date: "
        ),
        React.createElement("input", { id: "taskEnd", type: "date", name: "endDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}", required: true }),
        React.createElement(
            "label",
            { htmlFor: "description" },
            "Description: "
        ),
        React.createElement("input", { id: "taskDescription", type: "text", name: "description", placeholder: "Enter task description" }),
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

var TaskList = function TaskList(props) {
    if (props.tasks.length === 0) {
        return React.createElement(
            "div",
            { className: "taskList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Tasks yet!"
            )
        );
    }

    var taskNodes = props.tasks.map(function (task) {
        console.log(task);
        return React.createElement(
            "div",
            { key: task._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "taskName" },
                "Name: ",
                task.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "taskStart" },
                "Start Date: ",
                task.startDate,
                " "
            ),
            React.createElement(
                "h3",
                { className: "taskEnd" },
                "End Date: ",
                task.endDate,
                " "
            ),
            React.createElement(
                "p",
                null,
                task.description
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
                "Tasks"
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
        taskNodes
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

var loadTasksFromServer = function loadTasksFromServer() {
    sendAjax('GET', '/getTasks', null, function (data) {
        var taskList = data.tasks;
        taskList = sortList($("#sortSelector").val(), taskList);

        ReactDOM.render(React.createElement(TaskList, { tasks: taskList }), document.querySelector("#tasks"));

        //Add an onChange listener to the sort selector
        $("#sortSelector").change(function () {
            //Sort list based on selector
            taskList = sortList($("#sortSelector").val(), taskList);

            //Re-render Domolist after sorting
            ReactDOM.render(React.createElement(TaskList, { tasks: taskList }), document.querySelector("#tasks"));
        });
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
};

var setup2 = function setup2(csrf) {
    console.log("1");
    ReactDOM.render(React.createElement(TaskForm, { csrf: csrf }), document.querySelector("#makeTask"));
    console.log("2");
    ReactDOM.render(React.createElement(TaskList, { tasks: [] }), document.querySelector("#tasks"));
    console.log("3");
    loadTasksFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

var getToken2 = function getToken2() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup2(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken2();
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
