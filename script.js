// Creating Task List Element class
class TaskListElement extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('task-list-element');
        const content = document.importNode(template.content, true);
        this.appendChild(content);

        this.getData();
        this.createTasks();
    }

    // Getting data from server
    async getData() {
        const response = await fetch('https://reqres.in/api/users');
        if(!response.ok) {
            throw new Error(`getData error! status: ${response.status}`);
        }
        // Storing data from server in JSON
        const data = await response.json();
        return data;
    }

    // Adding Tasks to the DOM
    async createTasks() {
        // Await data from server
        let data = await this.getData();
        // Detect number of tasks
        let tasksQuntity = data.data.length;
        // Multiply task-element, that depends on number of tasks
        let i = 0;
        // Variables
        for (i = 0; i < tasksQuntity; i++) {
            // Creating all task elements
            const item = document.createElement('task-element');
            // Set Properties
            item.properties = {
                id: i,
                title: data.data[i].first_name,
                description: data.data[i].email,
                checked: undefined,
            }

            const { title, description, id } = item.properties;
            // Set each task unique id
            item.setAttribute('id', i);
            // Append created tasks to tasks-elements container
            document.querySelector('task-elements').appendChild(item);
            item.children;
            // Set task Title
            item.querySelector('h2').innerHTML = title;
            // Set task Description
            item.querySelector('p').innerHTML = description;
            // Set task ID
            item.id = id;
        }

        //OnClick event for each Task Element
        const items = this.querySelectorAll('task-element');
        items.forEach(item => {
            item.addEventListener('click', event => {
                // Separate OnClick events for Parent and Childs
                if(event.target.tagName === 'TASK-ELEMENT') {
                    const checkbox = event.target.querySelector('.checkbox');
                    onClickHandler(checkbox);
                } else {
                    const checkbox = event.target.parentNode.querySelector('.checkbox');
                    onClickHandler(checkbox);
                }

                // Toggle 'checked' class, display/hide 'checked' mark and toggle checked attribute
                function onClickHandler(checkbox) {
                    checkbox.classList.toggle('checked');
                    if (checkbox.classList.contains('checked')) {
                        checkbox.innerHTML = '&#10003;';
                        item.properties.checked = true;
    
                    } else {
                        checkbox.innerHTML = '';
                        item.properties.checked = false;
                    }
                }
                
                // POST request function
                async function postData() {
                    const { id, checked } = item.properties;
                    const response = await fetch('https://reqres.in/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({
                            "project-id": 1,
                            "name": id,
                            "checked": checked,
                        })
                    })
                    if(!response.ok) {
                        throw new Error(`postData error! status: ${response.status}`)
                    }
                    const serverResponse = await response.json();
                    console.log(serverResponse);
                }

                postData();
            })
        })
    }
}

// Creating Task Element class
class TaskElement extends TaskListElement {
    connectedCallback() {
        // Create Task Element
        const template = document.getElementById('task-element');
        const content = document.importNode(template.content, true);
        this.appendChild(content);
    }
}

window.customElements.define('task-element', TaskElement);
window.customElements.define('task-list', TaskListElement);