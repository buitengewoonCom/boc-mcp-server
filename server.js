import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const PABBLY_WEBHOOK = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjYwNTY4MDYzMTA0MzM1MjZiNTUzNiI_3D_pc/IjU3NjcwNTZlMDYzMzA0MzI1MjY4NTUzMjUxMzUi_pc";

app.get("/", (req, res) => {
  res.send("BOC MCP Server draait");
});

app.post("/task", async (req, res) => {
  try {
    const response = await axios.post(PABBLY_WEBHOOK, req.body);

    res.json({
      success: true,
      pabbly: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
