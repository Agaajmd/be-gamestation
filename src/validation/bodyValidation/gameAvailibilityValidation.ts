import Joi from "joi";

export const addGamesToDeviceSchema = Joi.object({
  gameIds: Joi.alternatives()
    .try(
      Joi.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "gameId harus berupa string angka",
      }),
      Joi.array()
        .items(
          Joi.string().pattern(/^\d+$/).messages({
            "string.pattern.base": "Setiap gameId harus berupa string angka",
          })
        )
        .min(1)
        .messages({
          "array.min": "gameIds tidak boleh kosong",
        })
    )
    .required()
    .messages({
      "any.required": "gameIds wajib diisi",
      "alternatives.match":
        "gameIds harus berupa string untuk 1 game atau array untuk multiple games",
    }),
});

export const removeGamesFromDeviceSchema = Joi.object({
  gameIds: Joi.alternatives()
    .try(
      Joi.string().pattern(/^\d+$/).messages({
        "string.pattern.base": "gameId harus berupa string angka",
      }),
      Joi.array()
        .items(
          Joi.string().pattern(/^\d+$/).messages({
            "string.pattern.base": "Setiap gameId harus berupa string angka",
          })
        )
        .min(1)
        .messages({
          "array.min": "gameIds tidak boleh kosong",
        })
    )
    .required()
    .messages({
      "any.required": "gameIds wajib diisi",
      "alternatives.match":
        "gameIds harus berupa string untuk 1 game atau array untuk multiple games",
    }),
});
