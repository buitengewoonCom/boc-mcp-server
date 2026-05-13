import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const PABBLY_WEBHOOK = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjYwNTY4MDYzMTA0MzM1MjZiNTUzNiI_3D_pc/IjU3NjcwNTZlMDYzMzA0MzI1MjY4NTUzMjUxMzUi_pc";

app.get("/", (req, res) => {
  res.json({
    name: "BOC OPS Connector",
    status: "online"
  });
});

app.post("/mcp", async (req, res) => {

  try {

    const body = req.body;

    await axios.post(PABBLY_WEBHOOK, body);

    res.json({
      success: true,
      message: "Data doorgestuurd naar BOC"
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
  console.log(`BOC OPS draait op poort ${PORT}`);
});
