import bcrypt from 'bcrypt';

const createHashedPassword = async (password) => {
    try {
        const saltRounds = 10; // Количество раундов для генерации соли
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Hashed Password:', hash);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

// Пример использования
console.log('ilyaLH', createHashedPassword('ilyaLH'));
console.log('user32', createHashedPassword('user32'));
