import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Use process.cwd() to ensure it finds the file from the project root
const swaggerPath = path.join(process.cwd(), "src", "docs", "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📖 Swagger UI: http://localhost:5000/api-docs");
};
