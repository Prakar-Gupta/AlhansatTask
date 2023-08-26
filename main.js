const addbutton = document.getElementById('addbutton')
const addtask = document.getElementById('addtask')
const cardContainer = document.querySelector('.card_container');
const Status = document.getElementById('status');

addbutton.addEventListener('click', async () => {
    const input = addtask.value.trim();

    if (input) {
        try {
            const response = await fetch('http://localhost:3000/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: input })
            });

            if (response.ok) {
                const newTask = await response.json();
                console.log('New task created:', newTask);
                addTaskCard(newTask, cardContainer.children.length)
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

function createTaskCard(task, index) {
    const card = document.createElement('div');
    card.classList.add('card');

    const serialNumber = document.createElement('p');
    serialNumber.textContent = index + 1;

    const taskName = document.createElement('p');
    taskName.textContent = task.name;

    const taskStatus = document.createElement('p');
    taskStatus.textContent = task.status;

    const button = document.createElement('button')
    button.textContent = getButtonContent(task.status)
    applyStyles(task.status)

    function getButtonContent(taskstatus) {
        if (taskstatus == 'To Do') {
            return 'Mark as Doing'
        }
        else if (taskstatus == 'Doing') {
            return 'Mark as Done'
        }
        else {
            return 'Congratulations!'
        }

    }

    function applyStyles(taskstatus) {
        console.log(taskStatus)
        button.style.border = 'transparent'
        button.style.color = 'white'
        button.style.cursor = 'pointer'
        if (taskstatus == 'To Do') {
            button.style.backgroundColor = 'blue'
        }
        else if (taskstatus == 'Doing') {
            button.style.backgroundColor = 'yellow'
        }
        else {
            button.style.backgroundColor = 'green'
        }
    }

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img_conatiner');

    const editIcon = document.createElement('img');
    editIcon.src = './icons/Edit.png';
    editIcon.alt = 'Edit';
    editIcon.style.cursor = 'pointer';

    button.addEventListener('click', async () => {
        let newStaus = '';
        if (task.status == 'To Do') {
            newStaus = 'Doing'
        }
        else if (task.status == 'Doing') {
            newStaus = 'Done'
        }
        else {
            newStaus = 'Done'
        }
        try {
            const response = await fetch(`http://localhost:3000/api/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStaus })
            })
            if (response.ok) {
                task.status = newStaus
                taskStatus.textContent = newStaus
                button.textContent = getButtonContent(newStaus)
                applyStyles(newStaus)

            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    })

    editIcon.addEventListener('click', async () => {
        const editName = window.prompt('Enter the editted name:')
        if (editName != '') {
            try {
                const response = await fetch(`http://localhost:3000/api/${task._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: editName })
                })
                if (response.ok) {
                    console.log('Name update successfully')
                    taskName.textContent = editName
                }
            }
            catch (error) {
                console.error('Error:', error);
            }
        }

    })

    const deleteIcon = document.createElement('img');
    deleteIcon.src = './icons/delete.png';
    deleteIcon.alt = 'Delete';
    deleteIcon.style.cursor = 'pointer';

    deleteIcon.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/${task._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Task deleted:', task._id);
                cardContainer.removeChild(card);
            } else {
                console.error('Failed to delete task');
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });

    imgContainer.appendChild(editIcon);
    imgContainer.appendChild(deleteIcon);

    card.appendChild(serialNumber);
    card.appendChild(taskName);
    card.appendChild(taskStatus);
    card.appendChild(button)
    card.appendChild(imgContainer);

    return card;
}

// Function to add a task card to the card container
function addTaskCard(task, index) {
    const card = createTaskCard(task, index);
    cardContainer.appendChild(card);
}



// Fetch tasks from server and display them on page load
let selectedStatus = '';
Status.addEventListener('change', () => {
    // console.log(Status.value)
    if (Status.value == 'todo') {
        selectedStatus = 'To Do'
    }
    else if (Status.value == 'doing') {
        selectedStatus = 'Doing'
    }
    else if (Status.value == 'done') {
        selectedStatus = 'Done'
    }
    else {
        selectedStatus = ''
    }
    cardContainer.innerHTML = '';
    getTasks(selectedStatus)
})

async function getTasks(selectedStatus) {
    try {
        const response = await fetch('http://localhost:3000/api/');
        if (response.ok) {
            const tasks = await response.json();
            tasks
                .filter(task => selectedStatus === '' || task.status === selectedStatus)
                .forEach((task, index) => {
                    addTaskCard(task, index);
                });
        } else {
            console.error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.addEventListener('load', async () => {
    getTasks('')

});