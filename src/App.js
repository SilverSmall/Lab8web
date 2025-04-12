import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Файл стилів

function App() {
    const [isRegisterMode, setIsRegisterMode] = useState(false); // Перемикач між реєстрацією та входом
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [token, setToken] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/register', {
                username,
                password,
                email,
                full_name: fullName,
            });

            if (response && response.data) {
                alert('Реєстрація успішна! Тепер ви можете увійти в систему.');
                setIsRegisterMode(false); // Повертаємося до форми входу
            } else {
                throw new Error('Порожня відповідь від сервера');
            }
        } catch (error) {
            if (error.response) {
                alert('Помилка реєстрації: ' + error.response.data.detail);
            } else if (error.request) {
                alert('Сервер не відповідає. Перевірте з\'єднання.');
            } else {
                alert('Щось пішло не так: ' + error.message);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
                username,
                password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            setToken(response.data.access_token);
            alert("Успішно авторизовано!");
        } catch (error) {
            alert("Помилка входу: " + error.response.data.detail);
        }
    };

    const getProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(`Ваше ім'я: ${response.data.full_name}`);
        } catch (error) {
            alert("Помилка отримання даних профілю");
        }
    };

    return (
        <div className="app-container">
            <div className="form-container">
                <h1 className="form-title">{isRegisterMode ? 'Реєстрація' : 'Вхід'}</h1>
                <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
                    <div className="form-group">
                        <label>Логін:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Введіть логін"
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Введіть пароль"
                        />
                    </div>
                    {isRegisterMode && (
                        <>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Введіть email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Повне ім'я:</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Введіть повне ім'я"
                                />
                            </div>
                        </>
                    )}
                    <button className="submit-button" type="submit">
                        {isRegisterMode ? 'Зареєструватися' : 'Увійти'}
                    </button>
                </form>
                <button
                    className="toggle-button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}>
                    {isRegisterMode ? 'У мене вже є акаунт' : 'Зареєструватися'}
                </button>
                {token && (
                    <div className="profile-section">
                        <button className="profile-button" onClick={getProfile}>
                            Отримати профіль
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;