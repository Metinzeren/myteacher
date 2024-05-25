class ValidationHelper {
  createErrorMessageByField = (fields: {}) => {
    let field = Object.keys(fields) as (keyof typeof fields)[];
    let errors = {} as any;
    field.forEach(key => {
      if (fields[key] === '') {
        errors[key] = `${key} alanı boş olamaz`;
      }
    });
    return errors;
  };
}
export default new ValidationHelper();
