import { join } from "node:path";

export const rootDir = import.meta.dir;
export const publicDir = join(rootDir, "public");
