import appRootPath from "app-root-path";
import sync from "file-exists";
import env from "node-env-file";

export function get() {
  const envFileLocation = appRootPath + "/.env";
  if (sync(envFileLocation)) {
    env(envFileLocation);
  }
}
