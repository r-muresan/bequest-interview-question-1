export function schemaBody(bodySchema: any) {
  return async function (req: any, res: any, next: any) {
    try {
      const validationBody = await bodySchema.validate(req.body);
      if (validationBody) {
        next();
      }
    } catch (error) {
      console.log({ error });
      res.status(422).send({ fields: "body", message: error });
    }
  };
}
