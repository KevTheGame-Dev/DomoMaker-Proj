"use strict";

var handleTask = function handleTask(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#taskName").val() == '' || $("#taskStart").val() == '' || $("#taskEnd").val() == '') {
        handleError("Aaah! All fields are required.");
        return false;
    }

    var data = $("#taskForm").serialize();

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        loadTasksFromServer();
        $("#taskName").val('');
        $("#taskStart").val('');
        $("#taskEnd").val('');
        $("#taskDescription").val('');
        document.querySelector("#overlay").style.display = "none";
        document.querySelector("#AddTask").style.display = "none";
        //Add subtask reset here
    });

    return false;
};

var TaskForm = function TaskForm(props) {
    //TO-DO ADD SUBTASK SELECTOR
    return React.createElement(
        "div",
        null,
        React.createElement(
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
                "Name* "
            ),
            React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name", required: true }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "startDate" },
                "Start Date* "
            ),
            React.createElement("input", { id: "taskStart", type: "date", name: "startDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}", required: true }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "endDate" },
                "End Date* "
            ),
            React.createElement("input", { id: "taskEnd", type: "date", name: "endDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}", required: true }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "description" },
                "Description: "
            ),
            React.createElement("input", { id: "taskDescription", type: "text", name: "description", placeholder: "Enter task description" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Create Task" })
        ),
        React.createElement(
            "button",
            { onClick: CancelAddTask },
            "Cancel"
        )
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
        return React.createElement(
            "div",
            { key: task._id, className: "task", id: "TASK_" + task._id },
            React.createElement(
                "h3",
                { className: "taskName" },
                "Name: ",
                task.name,
                " "
            ),
            "  ",
            React.createElement(
                "p",
                { className: "taskID" },
                " ",
                task._id,
                " "
            ),
            React.createElement(
                "h3",
                { className: "taskStart" },
                "Start: ",
                task.startDate,
                " "
            ),
            React.createElement(
                "h3",
                { className: "taskEnd" },
                "End: ",
                task.endDate,
                " "
            ),
            React.createElement(
                "p",
                null,
                task.description
            ),
            React.createElement(
                "button",
                { className: "taskEdit" },
                "\u270E Edit"
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
                )
            )
        ),
        taskNodes
    );
};

var loadTasksFromServer = function loadTasksFromServer() {
    sendAjax('GET', '/getTasks', null, function (data) {
        var taskList = data.tasks;

        for (var i = 0; i < taskList.length; i++) {
            taskList[i].startDate = formatDate(taskList[i].startDate);
            taskList[i].endDate = formatDate(taskList[i].endDate);
        }

        taskList = sortList($("#sortSelector").val(), taskList);

        ReactDOM.render(React.createElement(TaskList, { tasks: taskList }), document.querySelector("#tasks"));

        var taskDivs = document.querySelectorAll('*[id^="TASK_"]');

        var _loop = function _loop(_i) {

            taskDivs[_i].querySelector(".taskEdit").addEventListener("click", function () {
                var realID = taskDivs[_i].id.slice(5);
                showTaskUpdateForm(realID);
            });
        };

        for (var _i = 0; _i < taskDivs.length; _i++) {
            _loop(_i);
        }

        //Add an onChange listener to the sort selector
        $("#sortSelector").change(function () {
            //Sort list based on selector
            taskList = sortList($("#sortSelector").val(), taskList);

            //Re-render Domolist after sorting
            ReactDOM.render(React.createElement(TaskList, { tasks: taskList }), document.querySelector("#tasks"));
        });
    });
};

//Update Tasks
var TaskUpdateForm = function TaskUpdateForm(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "updateForm",
                onSubmit: updateTask,
                name: "updateForm",
                action: "/updateTask",
                method: "POST",
                className: "taskForm"
            },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "Name "
            ),
            React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "startDate" },
                "Start Date "
            ),
            React.createElement("input", { id: "taskStart", type: "date", name: "startDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "endDate" },
                "End Date "
            ),
            React.createElement("input", { id: "taskEnd", type: "date", name: "endDate", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}" }),
            React.createElement("br", null),
            React.createElement(
                "label",
                { htmlFor: "description" },
                "Description "
            ),
            React.createElement("input", { id: "taskDescription", type: "text", name: "description", placeholder: "Enter task description" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { id: "taskID", type: "hidden", name: "_id", value: "" }),
            React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Update Task" })
        ),
        React.createElement(
            "button",
            { onClick: cancelTaskUpdate },
            "Cancel"
        )
    );
};

var showTaskUpdateForm = function showTaskUpdateForm(taskID) {
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#UpdateTask").style.display = "block";

    document.querySelector("#taskID").value = taskID;
};

var cancelTaskUpdate = function cancelTaskUpdate() {
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#UpdateTask").style.display = "none";
};

var updateTask = function updateTask(e) {
    //console.log(e);
    e.preventDefault();

    sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), function () {
        loadTasksFromServer();
        $("#taskName").val('');
        $("#taskStart").val('');
        $("#taskEnd").val('');
        $("#taskDescription").val('');
        //Add subtask reset here
    });
};

var AddButton = function AddButton() {
    return React.createElement(
        "button",
        { onClick: ShowAddTask },
        " + Task "
    );
};

var ShowAddTask = function ShowAddTask() {
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#AddTask").style.display = "block";
};

var CancelAddTask = function CancelAddTask() {
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#AddTask").style.display = "none";
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TaskForm, { csrf: csrf }), document.querySelector("#AddTask"));

    ReactDOM.render(React.createElement(TaskList, { tasks: [] }), document.querySelector("#tasks"));

    ReactDOM.render(React.createElement(TaskUpdateForm, { csrf: csrf }), document.querySelector("#UpdateTask"));

    ReactDOM.render(React.createElement(AddButton, null), document.querySelector("#AddTaskButton"));

    loadTasksFromServer();
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
var sortList = function sortList(sortType, taskList) {
    switch (sortType) {
        case "Name_AZ":
            //Sort A -> Z
            taskList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            break;
        case "Name_ZA":
            //Sort Z -> A
            taskList.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });
            break;
        default:
            //Default to sorting A -> Z
            taskList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            break;
    }

    return taskList;
};
"use strict";

var handleError = function handleError(message) {
    alert(message);
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

var formatDate = function formatDate(date) {
    var tempDate = new Date(date);

    //tempDate = tempDate.toLocaleString('en-US', { timeZone: 'EST' });
    var tempMonth = tempDate.getMonth() + 1;
    var tempHours = tempDate.getHours();
    var amPM = '';
    if (tempHours > 12) {
        amPM = 'PM';
        tempHours -= 12;
    } else {
        amPM = 'AM';
    }
    var tempMin = tempDate.getMinutes();
    if (tempMin < 10) {
        tempMin = '0' + tempMin;
    };
    var tempYear = tempDate.getYear() + 1900;
    tempDate = tempMonth + '/' + tempDate.getDate() + '/' + tempYear + ' ' + tempHours + ':' + tempMin + amPM;

    return tempDate;
};
