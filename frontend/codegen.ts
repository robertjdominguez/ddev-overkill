import { CodegenConfig } from "@graphql-codegen/cli";

const hasuraUrl = "http://localhost:8080/v1/graphql";
const adminSecret = "myadminsecret";

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [hasuraUrl]: {
      headers: {
        "x-hasura-admin-secret": adminSecret,
      },
    },
  },
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
