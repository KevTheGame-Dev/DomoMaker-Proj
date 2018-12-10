
const handleTask = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#taskName").val() == '' || $("#taskStart").val() == '' || $("#taskEnd").val() == ''){
        handleError("Aaah! All fields are required.");
        return false;
    }
    
    let data = $("#taskForm").serialize();

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
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
}

const TaskForm = (props) => {//TO-DO ADD SUBTASK SELECTOR
    return (
        <div>
            <form id="taskForm"
                onSubmit={handleTask}
                name="taskForm"
                action="/maker"
                method="POST"
                className="taskForm"
            >
                <label htmlFor="name">Name* </label>
                <input id="taskName" type="text" name="name" placeholder="Task Name" required/><br/>
                <label htmlFor="startDate">Start Date* </label>
                <input id="taskStart" type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required/><br/>
                <label htmlFor="endDate">End Date* </label>
                <input id="taskEnd" type="date" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required/><br/>
                <label htmlFor="description">Description: </label>
                <input id="taskDescription" type="text" name="description" placeholder="Enter task description"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Create Task" />
            </form>
            <button onClick={CancelAddTask}>Cancel</button>
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
        return(
            <div key={task._id} className="task" id={"TASK_"+ task._id}>
                <h3 className="taskName">Name: {task.name} </h3>  <p className="taskID"> {task._id} </p>
                <h3 className="taskStart">Start: {task.startDate} </h3>
                <h3 className="taskEnd">End: {task.endDate} </h3>
                <p>{task.description}</p>
                <button className="taskEdit">&#9998; Edit</button>
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
                </select>
            </div>
            {taskNodes}
        </div>
    );
}

const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        let taskList = data.tasks;
        
        for(let i = 0; i < taskList.length; i++){
            taskList[i].startDate = formatDate(taskList[i].startDate);
            taskList[i].endDate = formatDate(taskList[i].endDate);
        }

        taskList = sortList($("#sortSelector").val(), taskList);

        ReactDOM.render(
            <TaskList tasks={taskList} />,
            document.querySelector("#tasks")
        );

        

        let taskDivs = document.querySelectorAll('*[id^="TASK_"]');
        for(let i = 0; i < taskDivs.length; i++){
            
            taskDivs[i].querySelector(".taskEdit").addEventListener("click", ()=>{
                let realID = taskDivs[i].id.slice(5);
                showTaskUpdateForm(realID);
            });
        }
 
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


//Update Tasks
const TaskUpdateForm = (props) => {
    return (
        <div>
            <form id="updateForm"
                onSubmit={updateTask}
                name="updateForm"
                action="/updateTask"
                method="POST"
                className="taskForm"
            >
                <label htmlFor="name">Name </label>
                <input id="taskName" type="text" name="name" placeholder="Task Name"/><br/>
                <label htmlFor="startDate">Start Date </label>
                <input id="taskStart" type="date" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"/><br/>
                <label htmlFor="endDate">End Date </label>
                <input id="taskEnd" type="date" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"/><br/>
                <label htmlFor="description">Description </label>
                <input id="taskDescription" type="text" name="description" placeholder="Enter task description"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id="taskID" type="hidden" name="_id" value=""/>
                <input className="makeDomoSubmit" type="submit" value="Update Task" />
            </form>
            <button onClick={cancelTaskUpdate}>Cancel</button>
        </div>
    );
}

const showTaskUpdateForm = (taskID) => {
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#UpdateTask").style.display = "block";

    document.querySelector("#taskID").value = taskID;
}

const cancelTaskUpdate = () => {
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#UpdateTask").style.display = "none";
}

const updateTask = (e) => {
    //console.log(e);
    e.preventDefault();

    sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), () => {
        loadTasksFromServer();
        $("#taskName").val('');
        $("#taskStart").val('');
        $("#taskEnd").val('');
        $("#taskDescription").val('');
        //Add subtask reset here
    });
}

const AddButton = () => {
    return (
        <button onClick={ShowAddTask}> &#x2b; Task </button>
    );
}

const ShowAddTask = () => {
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#AddTask").style.display = "block";
}

const CancelAddTask = () => {
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#AddTask").style.display = "none";
}

const setup = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#AddTask")
    );

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );

    ReactDOM.render(
        <TaskUpdateForm csrf={csrf} />,
        document.querySelector("#UpdateTask")
    );

    ReactDOM.render(
        <AddButton />,
        document.querySelector("#AddTaskButton")
    )
    
    loadTasksFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(() => {
    getToken();
});


//Sort helper function
const sortList = (sortType, taskList) => {
    switch(sortType){
        case "Name_AZ"://Sort A -> Z
            taskList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
        case "Name_ZA"://Sort Z -> A
            taskList.sort((a, b) => {
                return b.name.localeCompare(a.name);
            });
            break;
        default://Default to sorting A -> Z
            taskList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
    }

    return taskList;
}