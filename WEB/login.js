        // CREDENCIALES DEL SISTEMA
        const credentials = {
            'admin@uleam.edu.ec': 'admin12345',
            'admin': 'admin12345',
            'guardia': 'guardia12345',
            'guardia@uleam.edu.ec': 'guardia12345',
            'supervisor@uleam.edu.ec': 'supervisor12345',
            'supervisor': 'supervisor12345'
        };

        const form = document.getElementById('loginForm');
        const usuarioInput = document.getElementById('usuario');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const btnLogin = document.getElementById('btnLogin');

        // FUNCIONES DE VALIDACIÓN
        
        // Validar email institucional
        function validarEmail(email) {
            const regex = /^[a-zA-Z0-9._-]+@uleam\.edu\.ec$/;
            return regex.test(email);
        }

        // Mostrar error
        function showError(input, message) {
            input.classList.remove('valid');
            input.classList.add('error');
            const errorElement = document.getElementById(input.id + 'Error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        // Mostrar éxito
        function showSuccess(input) {
            input.classList.remove('error');
            input.classList.add('valid');
            const errorElement = document.getElementById(input.id + 'Error');
            errorElement.classList.remove('show');
        }

        // Limpiar validación
        function clearValidation(input) {
            input.classList.remove('error', 'valid');
            const errorElement = document.getElementById(input.id + 'Error');
            errorElement.classList.remove('show');
        }

        // VALIDACIÓN EN TIEMPO REAL - USUARIO
        usuarioInput.addEventListener('input', () => {
            const value = usuarioInput.value.trim();
            
            if (!value) {
                clearValidation(usuarioInput);
            } else if (value.includes('@')) {
                if (!validarEmail(value)) {
                    showError(usuarioInput, 'Debe usar un correo institucional (@uleam.edu.ec)');
                } else {
                    showSuccess(usuarioInput);
                }
            } else if (value.length < 3) {
                showError(usuarioInput, 'El usuario debe tener al menos 3 caracteres');
            } else {
                showSuccess(usuarioInput);
            }
        });

        // VALIDACIÓN EN TIEMPO REAL - CONTRASEÑA
        passwordInput.addEventListener('input', () => {
            const value = passwordInput.value;
            
            if (!value) {
                clearValidation(passwordInput);
            } else if (value.length < 8) {
                showError(passwordInput, 'La contraseña debe tener al menos 8 caracteres');
            } else {
                showSuccess(passwordInput);
            }
        });

        // MOSTRAR/OCULTAR CONTRASEÑA
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.textContent = type === 'password' ? '👁' : '🙈';
        });

        // RECUPERAR CONTRASEÑA
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Ingrese su correo institucional (@uleam.edu.ec):');
            
            if (email) {
                if (validarEmail(email)) {
                    alert('✓ Se ha enviado un enlace de recuperación a:\n' + email + '\n\nRevise su bandeja de entrada.');
                } else {
                    alert('⚠ Por favor ingrese un correo institucional válido\n(@uleam.edu.ec)');
                }
            }
        });

        // SUBMIT DEL FORMULARIO
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const usuario = usuarioInput.value.trim();
            const password = passwordInput.value;
            const recordarCheckbox = document.getElementById('recordar');
            
            // Validación final
            if (!usuario) {
                showError(usuarioInput, 'El usuario o correo es obligatorio');
                return;
            }
            
            if (!password) {
                showError(passwordInput, 'La contraseña es obligatoria');
                return;
            }

            // Verificar credenciales
            if (credentials[usuario] && credentials[usuario] === password) {
                // Guardar sesión
                localStorage.setItem('usuarioActivo', usuario);
                localStorage.setItem('horaLogin', new Date().toLocaleString('es-EC'));
                
                if (recordarCheckbox.checked) {
                    localStorage.setItem('recordarSesion', 'true');
                }
                
                // Animación de éxito
                btnLogin.disabled = true;
                btnLogin.textContent = '✓ Acceso concedido';
                btnLogin.classList.add('success');
                
                usuarioInput.classList.add('valid');
                passwordInput.classList.add('valid');
                
                // Redireccionar
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
                
            } else {
                // Error de credenciales
                showError(passwordInput, 'Usuario o contraseña incorrectos');
                passwordInput.value = '';
                
                btnLogin.classList.add('error');
                btnLogin.textContent = '✗ Credenciales incorrectas';
                
                setTimeout(() => {
                    btnLogin.classList.remove('error');
                    btnLogin.textContent = 'Iniciar Sesión';
                }, 2000);
            }
        });

        // CARGAR SESIÓN GUARDADA
        if (localStorage.getItem('recordarSesion') === 'true' && localStorage.getItem('usuarioActivo')) {
            window.location.href = 'dashboard.html';
        }
