
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        
        fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                
                alert('User already exists. Please choose a different username.');
            } else {
                
                fetch('https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Registration successful:', data);
                    
                    
                    localStorage.setItem('user_id', data.id);

                    
                    window.location.href = 'index.html';  
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    
                });
            }
        })
        .catch(error => {
            console.error('User existence check error:', error);
            
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        
        fetch(`https://658001c26ae0629a3f541e11.mockapi.io/api/v0/users?username=${username}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                
                const user = data[0];
                if (user.password === password) {
                    
                    console.log('Login successful:', user);

                    
                    localStorage.setItem('user_id', user.id);

                    
                    window.location.href = 'index.html';  
                } else {
                    
                    alert('Incorrect username or password. Please try again.');
                }
            } else {
                
                alert('User does not exist. Please check your username or sign up.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            
        });
    });
});