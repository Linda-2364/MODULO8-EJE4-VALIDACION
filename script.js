// ===============================================
// VALIDADOR DE FORMULARIO - VALIDACIONES CORREGIDAS
// ===============================================

// ------------ ELEMENTOS DEL DOM ------------
const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const age = document.getElementById('age');
const terms = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const formSummary = document.getElementById('formSummary');
const summaryContent = formSummary.querySelector('.summary-content');

// Elementos de requisitos de contraseña
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

// ------------ EXPRESIONES REGULARES ------------
// Correo debe terminar en .com
const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    number: /\d/,
    special: /[@$!%*?&]/
};

// ------------ ESTADO DE LOS CAMPOS ------------
const fieldStates = new Map();

// Inicializar estados
function initializeFieldStates() {
    fieldStates.set(username, { valid: null, touched: false });
    fieldStates.set(email, { valid: null, touched: false });
    fieldStates.set(password, { valid: null, touched: false });
    fieldStates.set(confirmPassword, { valid: null, touched: false });
    fieldStates.set(age, { valid: null, touched: false });
    fieldStates.set(terms, { valid: null, touched: false });
}

// ------------ FUNCIONES DE VALIDACIÓN ------------

/**
 * Validar nombre de usuario
 */
function validateUsername(value) {
    const trimmed = value.trim();
    
    if (!trimmed) {
        return {
            valid: false,
            message: 'El nombre de usuario es obligatorio'
        };
    }
    
    if (trimmed.length < 3) {
        return {
            valid: false,
            message: 'El nombre debe tener al menos 3 caracteres'
        };
    }
    
    if (trimmed.length > 20) {
        return {
            valid: false,
            message: 'El nombre no puede exceder 20 caracteres'
        };
    }
    
    if (!usernameRegex.test(trimmed)) {
        return {
            valid: false,
            message: 'Solo se permiten letras, números y guiones bajos'
        };
    }
    
    if (trimmed.includes(' ')) {
        return {
            valid: false,
            message: 'No se permiten espacios en el nombre de usuario'
        };
    }
    
    return {
        valid: true,
        message: 'Nombre de usuario válido'
    };
}

/**
 * Validar correo electrónico - DEBE TERMINAR EN .com
 */
function validateEmail(value) {
    const trimmed = value.trim();
    
    if (!trimmed) {
        return {
            valid: false,
            message: 'El correo electrónico es obligatorio'
        };
    }
    
    if (!emailRegex.test(trimmed)) {
        return {
            valid: false,
            message: 'El correo debe terminar en .com (ejemplo: usuario@dominio.com)'
        };
    }
    
    return {
        valid: true,
        message: 'Correo electrónico válido'
    };
}

/**
 * Validar contraseña
 */
function validatePassword(value) {
    if (!value) {
        return {
            valid: false,
            message: 'La contraseña es obligatoria'
        };
    }
    
    const errors = [];
    
    if (!passwordRegex.length.test(value)) {
        errors.push('Mínimo 8 caracteres');
    }
    
    if (!passwordRegex.uppercase.test(value)) {
        errors.push('Al menos una mayúscula');
    }
    
    if (!passwordRegex.number.test(value)) {
        errors.push('Al menos un número');
    }
    
    if (!passwordRegex.special.test(value)) {
        errors.push('Al menos un carácter especial (@$!%*?&)');
    }
    
    if (errors.length > 0) {
        return {
            valid: false,
            message: `Requisitos faltantes: ${errors.join(', ')}`
        };
    }
    
    return {
        valid: true,
        message: 'Contraseña segura'
    };
}

/**
 * Validar confirmación de contraseña
 */
function validateConfirmPassword(value, passwordValue) {
    if (!value) {
        return {
            valid: false,
            message: 'Confirma tu contraseña'
        };
    }
    
    if (value !== passwordValue) {
        return {
            valid: false,
            message: 'Las contraseñas no coinciden'
        };
    }
    
    return {
        valid: true,
        message: 'Contraseñas coinciden'
    };
}

/**
 * Validar edad - NO DEBE PERMITIR DECIMALES
 */
function validateAge(value) {
    const trimmed = value.trim();
    
    if (!trimmed) {
        return {
            valid: false,
            message: 'La edad es obligatoria'
        };
    }
    
    // Verificar que sea un número válido
    const ageNum = parseFloat(trimmed);
    
    if (isNaN(ageNum)) {
        return {
            valid: false,
            message: 'La edad debe ser un número'
        };
    }
    
    // Verificar que sea un número entero (sin decimales)
    if (!Number.isInteger(ageNum)) {
        return {
            valid: false,
            message: 'La edad debe ser un número entero (sin decimales)'
        };
    }
    
    // Verificar rango válido
    if (ageNum < 1) {
        return {
            valid: false,
            message: 'La edad debe ser un número positivo'
        };
    }
    
    if (ageNum < 18) {
        return {
            valid: false,
            message: 'Debes ser mayor de 18 años'
        };
    }
    
    if (ageNum > 130) {
        return {
            valid: false,
            message: 'Ingresa una edad válida (máximo 130 años)'
        };
    }
    
    return {
        valid: true,
        message: 'Edad válida'
    };
}

/**
 * Validar términos y condiciones
 */
function validateTerms(isChecked) {
    if (!isChecked) {
        return {
            valid: false,
            message: 'Debes aceptar los términos y condiciones'
        };
    }
    
    return {
        valid: true,
        message: 'Términos aceptados'
    };
}

/**
 * Actualizar indicadores visuales de contraseña
 */
function updatePasswordRequirements(value) {
    // Longitud
    if (passwordRegex.length.test(value)) {
        reqLength.classList.add('met');
        reqLength.classList.remove('unmet');
    } else {
        reqLength.classList.remove('met');
        reqLength.classList.add('unmet');
    }
    
    // Mayúscula
    if (passwordRegex.uppercase.test(value)) {
        reqUppercase.classList.add('met');
        reqUppercase.classList.remove('unmet');
    } else {
        reqUppercase.classList.remove('met');
        reqUppercase.classList.add('unmet');
    }
    
    // Número
    if (passwordRegex.number.test(value)) {
        reqNumber.classList.add('met');
        reqNumber.classList.remove('unmet');
    } else {
        reqNumber.classList.remove('met');
        reqNumber.classList.add('unmet');
    }
    
    // Carácter especial
    if (passwordRegex.special.test(value)) {
        reqSpecial.classList.add('met');
        reqSpecial.classList.remove('unmet');
    } else {
        reqSpecial.classList.remove('met');
        reqSpecial.classList.add('unmet');
    }
}

/**
 * Aplicar estado visual al campo
 */
function applyFieldState(field, validation, isTouched = false) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    const state = fieldStates.get(field);
    
    // Solo actualizar touched si es true
    if (isTouched) {
        state.touched = true;
    }
    
    // Si el campo no ha sido tocado y está vacío, mostrar estado neutral
    if (!state.touched && !field.value.trim()) {
        formGroup.classList.remove('valid', 'error');
        field.classList.remove('valid', 'invalid');
        errorMessage.textContent = '';
        state.valid = null;
        return;
    }
    
    // Si ha sido tocado o tiene valor, aplicar validación
    if (validation.valid) {
        // Estado válido
        formGroup.classList.remove('error');
        formGroup.classList.add('valid');
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorMessage.textContent = '';
        state.valid = true;
    } else {
        // Estado inválido
        formGroup.classList.remove('valid');
        formGroup.classList.add('error');
        field.classList.remove('valid');
        field.classList.add('invalid');
        errorMessage.textContent = validation.message;
        state.valid = false;
    }
}

/**
 * Validar campo individual
 */
function validateField(field, isTouched = false) {
    const value = field.value;
    let validation;
    
    switch(field.id) {
        case 'username':
            validation = validateUsername(value);
            break;
            
        case 'email':
            validation = validateEmail(value);
            break;
            
        case 'password':
            validation = validatePassword(value);
            updatePasswordRequirements(value);
            
            // Revalidar confirmación si ya tiene valor
            if (confirmPassword.value) {
                validateField(confirmPassword, isTouched);
            }
            break;
            
        case 'confirmPassword':
            validation = validateConfirmPassword(value, password.value);
            break;
            
        case 'age':
            validation = validateAge(value);
            break;
            
        default:
            return;
    }
    
    applyFieldState(field, validation, isTouched);
}

/**
 * Validar checkbox de términos
 */
function validateTermsField(isTouched = false) {
    const formGroup = terms.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    const state = fieldStates.get(terms);
    const validation = validateTerms(terms.checked);
    
    // Solo actualizar touched si es true
    if (isTouched) {
        state.touched = true;
    }
    
    // Si no ha sido tocado, mostrar estado neutral
    if (!state.touched && !terms.checked) {
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
        state.valid = null;
        return;
    }
    
    if (validation.valid) {
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
        state.valid = true;
    } else {
        formGroup.classList.add('error');
        errorMessage.textContent = validation.message;
        state.valid = false;
    }
}

/**
 * Verificar si todo el formulario es válido
 */
function checkFormValidity() {
    // Verificar si todos los campos son válidos
    let allValid = true;
    
    for (const [field, state] of fieldStates) {
        if (field !== terms) {
            // Para campos de input, verificar que sean válidos
            if (state.valid === false) {
                allValid = false;
                break;
            }
        } else {
            // Para términos, verificar que sean válidos
            if (state.valid === false) {
                allValid = false;
                break;
            }
        }
    }
    
    // También verificar que todos los campos tengan valor
    const fields = [username, email, password, confirmPassword, age];
    for (const field of fields) {
        if (!field.value.trim()) {
            allValid = false;
            break;
        }
    }
    
    if (!terms.checked) {
        allValid = false;
    }
    
    // Actualizar estado del botón
    submitBtn.disabled = !allValid;
    
    return allValid;
}

/**
 * Mostrar resumen del formulario
 */
function showFormSummary() {
    const content = `
        <h3>✓ ¡Registro Exitoso!</h3>
        <p><strong>Usuario:</strong> ${username.value}</p>
        <p><strong>Email:</strong> ${email.value}</p>
        <p><strong>Edad:</strong> ${age.value} años</p>
        <p>Los datos se han validado correctamente. Recibirás un correo de confirmación.</p>
    `;
    
    summaryContent.innerHTML = content;
    formSummary.classList.add('show');
    
    // Desplazar hasta el resumen
    formSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Limpiar formulario
 */
function clearForm() {
    form.reset();
    
    // Limpiar estados visuales
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'error');
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    // Limpiar mensajes de error
    document.querySelectorAll('.error-message').forEach(span => {
        span.textContent = '';
    });
    
    // Limpiar requisitos de contraseña
    updatePasswordRequirements('');
    
    // Limpiar resumen
    formSummary.classList.remove('show');
    
    // Reiniciar estados
    initializeFieldStates();
    
    // Deshabilitar botón de envío
    submitBtn.disabled = true;
    
    console.log('Formulario limpiado');
}

// ------------ EVENT LISTENERS ------------

// Validación en tiempo real para cada campo (sin touched)
username.addEventListener('input', () => {
    validateField(username, false);
    checkFormValidity();
});

username.addEventListener('blur', () => {
    validateField(username, true);
    checkFormValidity();
});

email.addEventListener('input', () => {
    validateField(email, false);
    checkFormValidity();
});

email.addEventListener('blur', () => {
    validateField(email, true);
    checkFormValidity();
});

password.addEventListener('input', () => {
    validateField(password, false);
    checkFormValidity();
});

password.addEventListener('blur', () => {
    validateField(password, true);
    checkFormValidity();
});

confirmPassword.addEventListener('input', () => {
    validateField(confirmPassword, false);
    checkFormValidity();
});

confirmPassword.addEventListener('blur', () => {
    validateField(confirmPassword, true);
    checkFormValidity();
});

// Para la edad, validar pero permitir que se escriba temporalmente
age.addEventListener('input', () => {
    // Permitir que el usuario escriba, pero validar sin touched
    validateField(age, false);
    checkFormValidity();
});

age.addEventListener('blur', () => {
    validateField(age, true);
    checkFormValidity();
});

terms.addEventListener('change', () => {
    validateTermsField(true);
    checkFormValidity();
});

// Limpiar formulario
clearBtn.addEventListener('click', clearForm);

// Envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como touched
    [username, email, password, confirmPassword, age].forEach(field => {
        const state = fieldStates.get(field);
        state.touched = true;
        validateField(field, true);
    });
    
    validateTermsField(true);
    
    if (!checkFormValidity()) {
        // Encontrar el primer error y desplazarse hasta él
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Mostrar resumen
    showFormSummary();
    
    console.log('Formulario enviado:', {
        username: username.value,
        email: email.value,
        age: age.value
    });
    
    // Limpiar después de 5 segundos
    setTimeout(clearForm, 5000);
});

// ------------ INICIALIZACIÓN ------------
// Inicializar estados
initializeFieldStates();

// Configurar estado inicial del botón
submitBtn.disabled = true;

// Configurar requisitos de contraseña iniciales
updatePasswordRequirements('');

console.log('Validador de formulario iniciado');