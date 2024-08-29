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
  regexEmail = (email: string) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  };
}
export default new ValidationHelper();
