
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("Aaah! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer();
        $("#domoName").val('');
        $("#domoAge").val('');
        $("#domoLevel").val('');
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

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(() => {
    getToken();
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
