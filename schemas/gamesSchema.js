import joi from "joi";

export const newGameSchema = joi.object({
    title: joi.string().required().min(3).max(50),
    genre: joi.string().required().min(3).max(50),
    rating: joi.number().required().positive()
});

export const updateGameSchema = joi.object({
    title: joi.string().min(3).max(50),
    genre: joi.string().min(3).max(50),
    rating: joi.number().positive()
});

// {
//     id: 1,
//     title: "Dead Cells",
//     genre: "Metroidvania, Action",
//     rating: 10
// }