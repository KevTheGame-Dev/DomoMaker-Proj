
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("Aaah! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer();
        //$("#domoName").val('');
        //$("#domoAge").val('');
        //$("#domoLevel").val('');
    });

    return false;
}

const handleTask = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#taskName").val() == '' || $("#taskStart").val() == '' || $("#taskEnd").val() == ''){
        handleError("Aaah! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
        loadTasksFromServer();
        $("#taskName").val('');
        $("#taskStart").val('');
        $("#taskEnd").val('');
        $("#taskDescription").val('');
        //Add subtask reset here
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const TaskForm = (props) => {//TO-DO ADD SUBTASK SELECTOR
    return (
        <form id="taskForm"
            onSubmit={handleTask}
            name="taskForm"
            action="/maker"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="taskName" type="text" name="name" placeholder="Task Name" required/>
            <label htmlFor="startDate">Start Date: </label>
            <input id="taskStart" type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required/>
            <label htmlFor="endDate">End Date: </label>
            <input id="taskEnd" type="date" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required/>
            <label htmlFor="description">Description: </label>
            <input id="taskDescription" type="text" name="description" placeholder="Enter task description"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map((domo) => {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
                <h3 className="domoLevel">Level: {domo.level} </h3>
            </div>
        );
    });


    return (
        <div className="domoList">
            <div id="domoHeader"> <h2>Domos</h2> </div>
            <div id="domoSortDiv">
                <label htmlFor="sort">Sort: </label>
                <select id="sortSelector" name="sort">
                    <option value="Name_AZ">Name: A -> Z</option>
                    <option value="Name_ZA">Name: Z -> A</option>
                    <option value="Age_A">Age: Ascending</option>
                    <option value="Age_D">Age: Descending</option>
                    <option value="Level_A">Level: Ascending</option>
                    <option value="Level_D">Level: Descending</option>
                </select>
            </div>
            {domoNodes}
        </div>
    );
}

const TaskList = (props) => {
    if(props.tasks.length === 0){
        return (
            <div className="taskList">
                <h3 className="emptyDomo">No Tasks yet!</h3>
            </div>
        );
    }

    const taskNodes = props.tasks.map((task) => {
        console.log(task);
        return(
            <div key={task._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="taskName">Name: {task.name} </h3>
                <h3 className="taskStart">Start Date: {task.startDate} </h3>
                <h3 className="taskEnd">End Date: {task.endDate} </h3>
                <p>{task.description}</p>
            </div>
        );
    });


    return (
        <div className="domoList">
            <div id="domoHeader"> <h2>Tasks</h2> </div>
            <div id="domoSortDiv">
                <label htmlFor="sort">Sort: </label>
                <select id="sortSelector" name="sort">
                    <option value="Name_AZ">Name: A -> Z</option>
                    <option value="Name_ZA">Name: Z -> A</option>
                    <option value="Age_A">Age: Ascending</option>
                    <option value="Age_D">Age: Descending</option>
                    <option value="Level_A">Level: Ascending</option>
                    <option value="Level_D">Level: Descending</option>
                </select>
            </div>
            {taskNodes}
        </div>
    );
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        let domoList = data.domos;
        domoList = sortList($("#sortSelector").val(), domoList);

        ReactDOM.render(
            <DomoList domos={domoList} />,
            document.querySelector("#domos")
        );

        //Add an onChange listener to the sort selector
        $("#sortSelector").change(() => {
            //Sort list based on selector
            domoList = sortList($("#sortSelector").val(), domoList);

            //Re-render Domolist after sorting
            ReactDOM.render(
                <DomoList domos={domoList} />,
                document.querySelector("#domos")
            );
        });
    });
}

const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        let taskList = data.tasks;
        taskList = sortList($("#sortSelector").val(), taskList);

        ReactDOM.render(
            <TaskList tasks={taskList} />,
            document.querySelector("#tasks")
        );

        //Add an onChange listener to the sort selector
        $("#sortSelector").change(() => {
            //Sort list based on selector
            taskList = sortList($("#sortSelector").val(), taskList);

            //Re-render Domolist after sorting
            ReactDOM.render(
                <TaskList tasks={taskList} />,
                document.querySelector("#tasks")
            );
        });
    });
}

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />,
        document.querySelector("#domos")
    );

    loadDomosFromServer();
}

const setup2 = (csrf) => {
    console.log("1");
    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );
    console.log("2");
    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );
    console.log("3");
    loadTasksFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

const getToken2 = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup2(result.csrfToken);
    });
}

$(document).ready(() => {
    getToken2();
});


//Sort helper function
const sortList = (sortType, domoList) => {
    switch(sortType){
        case "Name_AZ"://Sort A -> Z
            domoList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
        case "Name_ZA"://Sort Z -> A
            domoList.sort((a, b) => {
                return b.name.localeCompare(a.name);
            });
            break;
        case "Age_A"://Sort age ascending
            domoList.sort((a, b) => {
                return a.age - b.age;
            });
            break;
        case "Age_D"://Sort age descending
            domoList.sort((a, b) => {
                return b.age - a.age;
            });
            break;
        case "Level_A"://Sort level ascending
            domoList.sort((a, b) => {
                return a.level - b.level;
            });
            break;
        case "Level_D"://Sort level descending
            domoList.sort((a, b) => {
                return b.level - a.level;
            });
            break;
        default://Default to sorting A -> Z
            domoList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
    }

    return domoList;
}
