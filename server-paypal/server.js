import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paypal from "@paypal/checkout-server-sdk";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configuración PayPal (sandbox o live)
const environment =
  process.env.PAYPAL_MODE === "live"
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// Ruta prueba
app.get("/", (req, res) => res.send("Servidor PayPal OK 🚀"));

// Crear orden
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount
          }
        }
      ]
    });

    const order = await client.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando orden" });
  }
});

// Capturar orden
app.post("/capture-order", async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    res.json(capture.result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error capturando pago" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));
