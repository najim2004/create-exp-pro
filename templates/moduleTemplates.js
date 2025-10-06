const { capitalize } = require("../utils");

const getModuleRouteTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Router } from 'express';
import { ${capitalized}Controllers } from './${moduleName}.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ${capitalized}Validations } from './${moduleName}.validation.js';

const router = Router();

router.post(
  '/',
  validateRequest(${capitalized}Validations.create${capitalized}ValidationSchema),
  ${capitalized}Controllers.create${capitalized},
);

router.get('/', ${capitalized}Controllers.getAll${capitalized}s);

router.get('/:id', ${capitalized}Controllers.getSingle${capitalized});

router.patch(
  '/:id',
  validateRequest(${capitalized}Validations.update${capitalized}ValidationSchema),
  ${capitalized}Controllers.update${capitalized},
);

router.delete('/:id', ${capitalized}Controllers.delete${capitalized});

export const ${moduleName}Routes = router;
`;
};

const getModuleControllerTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Request, Response, NextFunction } from 'express';
import { ${capitalized}Services } from './${moduleName}.service.js';

const create${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${capitalized}Services.create${capitalized}IntoDB(req.body);
    res.status(201).json({
      success: true,
      message: '${capitalized} created successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAll${capitalized}s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${capitalized}Services.getAll${capitalized}sFromDB();
    res.status(200).json({
      success: true,
      message: '${capitalized}s retrieved successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingle${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ${capitalized}Services.getSingle${capitalized}FromDB(id);
    res.status(200).json({
      success: true,
      message: '${capitalized} retrieved successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ${capitalized}Services.update${capitalized}IntoDB(id, req.body);
    res.status(200).json({
      success: true,
      message: '${capitalized} updated successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const delete${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ${capitalized}Services.delete${capitalized}FromDB(id);
    res.status(200).json({
      success: true,
      message: '${capitalized} deleted successfully!',
      data: null,
    });
  } catch (err) {
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
    return `import { T${capitalized} } from './${moduleName}.interface.js';
import { ${capitalized} } from './${moduleName}.model.js';

const create${capitalized}IntoDB = async (payload: T${capitalized}) => {
  const result = await ${capitalized}.create(payload);
  return result;
};

const getAll${capitalized}sFromDB = async () => {
  const result = await ${capitalized}.find();
  return result;
};

const getSingle${capitalized}FromDB = async (id: string) => {
  const result = await ${capitalized}.findById(id);
  return result;
};

const update${capitalized}IntoDB = async (id: string, payload: Partial<T${capitalized}>) => {
  const result = await ${capitalized}.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return result;
};

const delete${capitalized}FromDB = async (id: string) => {
  const result = await ${capitalized}.findByIdAndDelete(id);
  return result;
};

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
const create${capitalized}IntoDB = async (payload: Record<string, any>) => {
  console.log('Dummy service: creating ${moduleName} with payload', payload);
  return payload;
};
const getAll${capitalized}sFromDB = async () => { return []; };
const getSingle${capitalized}FromDB = async (id: string) => { return { id }; };
const update${capitalized}IntoDB = async (id: string, payload: Record<string, any>) => { return { id, ...payload }; };
const delete${capitalized}FromDB = async (id: string) => { return { id }; };

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

const create${capitalized}ValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    // Add more fields for your ${moduleName}
  }),
});

const update${capitalized}ValidationSchema = create${capitalized}ValidationSchema.deepPartial();

export const ${capitalized}Validations = {
  create${capitalized}ValidationSchema,
  update${capitalized}ValidationSchema,
};
`;
};

const getModuleModelTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Schema, model } from 'mongoose';
import { T${capitalized} } from './${moduleName}.interface.js';

const ${moduleName}Schema = new Schema<T${capitalized}>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

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
