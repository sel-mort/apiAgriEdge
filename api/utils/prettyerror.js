module.exports = error => {
  const errors = {};
  console.log(error);
  error.details.forEach(item => {
    errors[item.context.key] = item.message;
  });

  return errors;
};
