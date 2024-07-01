import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

module.exports = async () => {
  // Stop Docker containers
  await execAsync("npm run docker:down");
};
