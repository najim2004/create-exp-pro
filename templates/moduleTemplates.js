const { capitalize } = require("../utils");

const getModuleRouteTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Router } from 'express';
import { ${capitalized}Controllers } from './${moduleName}.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ${capitalized}Validations } from './${moduleName}.validation';

const router = Router();

router.post(
  '/',
  validateRequest(${capitalized}Validations.create${capitalized}Schema),
  ${capitalized}Controllers.create${capitalized},
);

router.get('/', ${capitalized}Controllers.getAll${capitalized}s);
router.get('/:id', ${capitalized}Controllers.getSingle${capitalized});

router.patch(
  '/:id',
  validateRequest(${capitalized}Validations.update${capitalized}Schema),
  ${capitalized}Controllers.update${capitalized},
);

router.delete('/:id', ${capitalized}Controllers.delete${capitalized});

export const ${moduleName}Routes = router;
`;
};

const getModuleControllerTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Request, Response, NextFunction } from 'express';
import { ${capitalized}Services } from './${moduleName}.service';
import logger from '../../utils/logger';

const create${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Creating a new ${moduleName}...');
  try {
    const result = await ${capitalized}Services.create${capitalized}IntoDB(req.body);
    logger.info('${capitalized} created successfully!');
    res.status(201).json({ success: true, message: '${capitalized} created successfully!', data: result });
  } catch (err) {
    logger.error(err, 'Error creating ${moduleName}');
    next(err);
  }
};

const getAll${capitalized}s = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Fetching all ${moduleName}s...');
  try {
    const result = await ${capitalized}Services.getAll${capitalized}sFromDB();
    res.status(200).json({ success: true, message: '${capitalized}s retrieved successfully!', data: result });
  } catch (err) {
    logger.error(err, 'Error fetching all ${moduleName}s');
    next(err);
  }
};

const getSingle${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  logger.info(\`Fetching ${moduleName} with id: \${id}...\`);
  try {
    const result = await ${capitalized}Services.getSingle${capitalized}FromDB(id);
    res.status(200).json({ success: true, message: '${capitalized} retrieved successfully!', data: result });
  } catch (err) {
    logger.error(err, 'Error fetching single ${moduleName}');
    next(err);
  }
};

const update${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  logger.info(\`Updating ${moduleName} with id: \${id}...\`);
  try {
    const result = await ${capitalized}Services.update${capitalized}IntoDB(id, req.body);
    res.status(200).json({ success: true, message: '${capitalized} updated successfully!', data: result });
  } catch (err) {
    logger.error(err, 'Error updating ${moduleName}');
    next(err);
  }
};

const delete${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  logger.info(\`Deleting ${moduleName} with id: \${id}...\`);
  try {
    await ${capitalized}Services.delete${capitalized}FromDB(id);
    res.status(200).json({ success: true, message: '${capitalized} deleted successfully!', data: null });
  } catch (err) {
    logger.error(err, 'Error deleting ${moduleName}');
    next(err);
  }
};

export const ${capitalized}Controllers = {
  create${capitalized},
  getAll${capitalized}s,
  getSingle${capitalized},
  update${capitalized},
  delete${capitalized},
};
`;
};

const getModuleServiceTemplate = (moduleName, hasModel) => {
  const capitalized = capitalize(moduleName);
  if (hasModel) {
    return `import { T${capitalized} } from './${moduleName}.interface';
import { ${capitalized} } from './${moduleName}.model';

const create${capitalized}IntoDB = async (payload: T${capitalized}) => ${capitalized}.create(payload);
const getAll${capitalized}sFromDB = async () => ${capitalized}.find();
const getSingle${capitalized}FromDB = async (id: string) => ${capitalized}.findById(id);
const update${capitalized}IntoDB = async (id: string, payload: Partial<T${capitalized}>) =>
  ${capitalized}.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const delete${capitalized}FromDB = async (id: string) => ${capitalized}.findByIdAndDelete(id);

export const ${capitalized}Services = {
  create${capitalized}IntoDB,
  getAll${capitalized}sFromDB,
  getSingle${capitalized}FromDB,
  update${capitalized}IntoDB,
  delete${capitalized}FromDB,
};
`;
  }
  return `// Dummy service for ${moduleName}
const create${capitalized}IntoDB = async (payload: Record<string, unknown>) => payload;
const getAll${capitalized}sFromDB = async () => [];
const getSingle${capitalized}FromDB = async (id: string) => ({ id });
const update${capitalized}IntoDB = async (id: string, payload: Record<string, unknown>) => ({ id, ...payload });
const delete${capitalized}FromDB = async (id: string) => ({ id });

export const ${capitalized}Services = {
  create${capitalized}IntoDB,
  getAll${capitalized}sFromDB,
  getSingle${capitalized}FromDB,
  update${capitalized}IntoDB,
  delete${capitalized}FromDB,
};
`;
};

const getModuleValidationTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { z } from 'zod';

export const create${capitalized}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

export const update${capitalized}Schema = create${capitalized}Schema.partial();

export type Create${capitalized}Input = z.infer<typeof create${capitalized}Schema>['body'];
export type Update${capitalized}Input = z.infer<typeof update${capitalized}Schema>['body'];

export const ${capitalized}Validations = {
  create${capitalized}Schema,
  update${capitalized}Schema,
};
`;
};

const getModuleModelTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Schema, model } from 'mongoose';
import { T${capitalized} } from './${moduleName}.interface';

const ${moduleName}Schema = new Schema<T${capitalized}>({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const ${capitalized} = model<T${capitalized}>('${capitalized}', ${moduleName}Schema);
`;
};

const getModuleInterfaceTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `export type T${capitalized} = {
  name: string;
};
`;
};

module.exports = {
  getModuleRouteTemplate,
  getModuleControllerTemplate,
  getModuleServiceTemplate,
  getModuleValidationTemplate,
  getModuleModelTemplate,
  getModuleInterfaceTemplate,
};
