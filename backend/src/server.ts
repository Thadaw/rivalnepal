import { app } from "./app";
import { config } from "./shared/config";

const PORT = process.env.PORT || config.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Rival Nepal API listening on port ${PORT}`);
});