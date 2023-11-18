
// Funcion para generar un codigo random
export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = Math.floor(Math.random() * 36); 
        return randomNum.toString(36);
    })
        .join('')
        .toUpperCase();
}

