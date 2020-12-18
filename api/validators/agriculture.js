const Joi = require('@hapi/joi');

const name = Joi.string().required();
const previousHarvest = Joi.string();
const previousYield = Joi.number();
const dateOfPlanting = Joi.date();
const irrigationSystem = Joi.string();
const targetHarvest = Joi.string().required();


const position = Joi.array().items(Joi.array().items().min(2));

//const positions = Joi.array().ordered(position).required();

exports.createAgricultureValidator = Joi.object().keys({
    name: name,
    position: position,
    previousHarvest: previousHarvest,
    previousYield: previousYield,
    dateOfPlanting: dateOfPlanting,
    irrigationSystem: irrigationSystem,
    targetHarvest: targetHarvest,
});

