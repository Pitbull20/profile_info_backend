import { body } from "express-validator";

const registerValidation = [
    body("email", "Не вірний формат email").isEmail(),
    body("password", "Пароль занадто короткий").isLength({ min: 5 }),
    body("firstName", "Ім'я не може бути коротшим ніж 1 символ").isLength({
        min: 2,
    }),
    body("secondName", "Прізвище не може бути коротшим ніж 1 символ").isLength({
        min: 2,
    }),
    body("phoneNumber", "Не вірний формат телефону").isMobilePhone("any", {
        strictMode: false,
    }),
];

export { registerValidation };
