const Joi = require('@hapi/joi');

const name = Joi.string().required();
const previousHarvest = Joi.string();
const previousYield = Joi.number();
const dateOfPlanting = Joi.date();
const irrigationSystem = Joi.string();
const targetHarvest = Joi.string().required();
const targetYield = Joi.number().required();

exports.createAgricultureValidator = Joi.object().keys({
    name: name,
    previousHarvest: previousHarvest,
    previousYield: previousYield,
    dateOfPlanting: dateOfPlanting,
    irrigationSystem: irrigationSystem,
    targetHarvest: targetHarvest,
    targetYield: targetYield,
});

