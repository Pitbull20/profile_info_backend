import jwt from "jsonwebtoken";
import bcript, { hash } from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcript.genSalt(10);

        const hash = await bcript.hash(password, salt);

        const doc = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            passwordHash: hash,
            avatarUrl: "",
            phoneNumber: req.body.phoneNumber,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secretKey2023",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Не вдалось зареєструватися",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "Не вірний логін або пароль",
            });
        }

        const isValidPassword = await bcript.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPassword) {
            return res.status(404).json({
                message: "Не вірний логін або пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secretKey2023",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (e) {
        res.status(500).json({
            message: "Не вдалось увійти",
        });
    }
};

export const getProfileInfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Користувач не знайдений",
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (e) {
        res.status(500).json({
            message: "Користувач не знайдений",
        });
    }
};

export const addPhoto = async (req, res) => {
    const userData = {
        avatarUrl: req.body.avatarUrl,
    };

    // Оновіть користувача в базі даних
    User.findByIdAndUpdate(req.userId, userData, { new: true })
        .then((updatedUser) => {
            res.json({ message: "Користувач оновлений:", updatedUser });
        })
        .catch((error) => {
            res.json({ message: "Помилка при оновленні користувача:" });
        });
};
