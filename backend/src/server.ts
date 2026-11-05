import { app } from "./app";
import { config } from "./shared/config";

app.listen(config.PORT, () => console.log(`Rival API listening on port ${config.PORT}`));
