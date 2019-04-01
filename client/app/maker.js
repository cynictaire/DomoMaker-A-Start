const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#domoName").val() === '' || $("#domoAge").val() === '' || $("#domoHeight").val() === '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

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
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="height">Height: </label>
            <input id="domoHeight" type="text" name="height" placeholder="Domo Height"/>
            <input type="hidden" id="csrfVal" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

// Delete Domos
const handleDelete = (e, domo) => {

    //console.log($(`#${domo.name}deleteForm`).serialize());
    
    let domoSerialize = $(`#${domo.name}deleteForm`).serialize() + document.querySelector("#csrfVal").value;
    
    //console.log(domoSerialize);
    
    sendAjax('POST', $(`#${domo.name}deleteForm`).attr("action"), domoSerialize, function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoHeight"> Height: {domo.height} </h3>
                
                <form id={`${domo.name}deleteForm`} 
                      onSubmit={(e) => handleDelete(e, domo)}
                      name="deleteForm"
                      action="/delete"
                      method="POST"
                >
                    <input type="hidden" name="domoID" value={domo._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input type="submit" value="Delete Domo"/>
                </form>
            </div>
        );
    });
        
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
        <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoForm domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken(); 
});