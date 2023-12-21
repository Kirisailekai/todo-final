document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');
    const todoList = document.getElementById('todo-list');
    const newTodoForm = document.getElementById('new-todo-form');
    const nameInput = document.getElementById('name');

    
    const userId = localStorage.getItem('user_id');

    
    if (!userId) {
        
        window.location.href = 'login.html'; 
    }

    
    fetchTasks();

    
    newTodoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const content = document.getElementById('content').value;
        const category = document.querySelector('input[name="category"]:checked').value;

        
        fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                category: category,
            }),
        })
            .then(response => response.json())
            .then(newTask => {
                
                saveTask(newTask);
                
                displayTask(newTask);
                
                newTodoForm.reset();
            })
            .catch(error => {
                console.error('Error adding new task:', error);
                
            });
    });

    
    logoutButton.addEventListener('click', function () {
        
        localStorage.removeItem('user_id');
        window.location.href = 'login.html'; 
    });

    
	function fetchTasks() {
		
		fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks`)
			.then(response => response.json())
			.then(tasks => {
				
				localStorage.setItem('tasks', JSON.stringify(tasks));

				
				todoList.innerHTML = '';

				
				tasks.forEach(task => {
					displayTask(task);
				});
			})
			.catch(error => {
				console.error('Error fetching tasks:', error);
				
			});
	}


		
		function saveTask(task) {
			const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
			savedTasks.push(task);
			localStorage.setItem('tasks', JSON.stringify(savedTasks));
		}

		
function displayTask(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task';
    taskItem.innerHTML = `
        <p>${task.content}</p>
        <span class="category ${task.category}">${task.category}</span>
        <button class="delete-button" data-task-id="${task.id}">Delete</button>
        <button class="edit-button" data-task-id="${task.id}">Edit</button>
        <button class="save-button" data-task-id="${task.id}" style="display: none;">Save</button>
    `;
    todoList.appendChild(taskItem);

    
    const deleteButton = taskItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        deleteTask(taskId);
    });

    
    const editButton = taskItem.querySelector('.edit-button');
    editButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        editTask(taskId);
    });

    
    const saveButton = taskItem.querySelector('.save-button');
    saveButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-task-id');
        updateTask(taskId);
    });
}


function editTask(taskId) {
    
    fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            
            document.getElementById('content').value = task.content;
            const categoryRadio = document.querySelector(`input[name="category"][value="${task.category}"]`);
            if (categoryRadio) {
                categoryRadio.checked = true;
            }

            
            const saveButton = document.querySelector(`.save-button[data-task-id="${taskId}"]`);
            saveButton.style.display = 'inline-block';

            
            saveButton.addEventListener('click', function () {
                const content = document.getElementById('content').value;
                const category = document.querySelector('input[name="category"]:checked').value;

                
                fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: content,
                        category: category,
                    }),
                })
                    .then(response => response.json())
                    .then(updatedTask => {
                        
                        const taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);
                        taskElement.querySelector('p').textContent = updatedTask.content;
                        taskElement.querySelector('.category').className = `category ${updatedTask.category}`;
                        taskElement.querySelector('.category').textContent = updatedTask.category;

                        
                        saveButton.style.display = 'none';

                        
                        clearForm();
                    })
                    .catch(error => {
                        console.error('Error updating task:', error);
                        
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching task for editing:', error);
            
        });
}


function updateTask(taskId) {
    const content = document.getElementById('content').value;
    const category = document.querySelector('input[name="category"]:checked').value;

    
    fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: content,
            category: category,
        }),
    })
        .then(response => response.json())
        .then(updatedTask => {
            
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            taskElement.querySelector('p').textContent = updatedTask.content;
            taskElement.querySelector('.category').className = `category ${updatedTask.category}`;
            taskElement.querySelector('.category').textContent = updatedTask.category;

            
            const saveButton = document.querySelector(`.save-button[data-task-id="${taskId}"]`);
            saveButton.style.display = 'none';

            
            clearForm();
        })
        .catch(error => {
            console.error('Error updating task:', error);
            
        });
}


function clearForm() {
    document.getElementById('content').value = '';
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => (radio.checked = false));
}


	
	function deleteTask(taskId) {
		
		const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

		
		fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users/${userId}/tasks/${taskId}`, {
			method: 'DELETE',
		})
			.then(response => {
				if (response.ok) {
					
					taskElement.remove();
					
					removeTaskFromLocalStorage(taskId);
					
					
					fetchTasks();
				} else {
					console.error('Error deleting task:', response.statusText);
					
				}
			})
			.catch(error => {
				console.error('Delete task error:', error);
				
			});
	}

	
	function removeTaskFromLocalStorage(taskId) {
		const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
		const updatedTasks = savedTasks.filter(task => task.id !== taskId);
		localStorage.setItem('tasks', JSON.stringify(updatedTasks));
	}
});