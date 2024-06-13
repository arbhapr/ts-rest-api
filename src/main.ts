import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(3000, () => {
    logger.info("Server listening on http://localhost:3000");
});
