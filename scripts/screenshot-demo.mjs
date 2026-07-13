import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots");
const base = "http://localhost:3000";

fs.mkdirSync(outDir, { recursive: true });

async function shot(page, name, fullPage = true) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage, type: "png" });
  console.log("OK", name);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "pt-BR",
  });
  const page = await context.newPage();

  // 1) HOME completa
  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  await shot(page, "01-home-completa.png", true);
  // recorte hero (viewport)
  await shot(page, "01b-home-topo.png", false);

  // 2) CHECKOUT / inscrição
  await page.goto(base + "/inscrever", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  await shot(page, "02-checkout-inscricao.png", true);

  // Preenche formulário demo e vai pro pagamento Pix
  await page.fill('input[name="full_name"]', "Atleta Demonstracao");
  await page.fill('input[name="cpf"]', "529.982.247-25");
  await page.fill('input[name="phone"]', "11999998888");
  await page.fill('input[name="email"]', "demo@corrida.com");
  // clica Pix se existir
  const pixBtn = page.getByRole("button", { name: /Pix/i }).first();
  if (await pixBtn.count()) await pixBtn.click();
  await page.getByRole("button", { name: /Pagar com Pix|Finalizar|Pagar/i }).first().click();
  await page.waitForTimeout(1500);
  await shot(page, "03-pagamento-pix.png", true);

  // Cartão: volta e refaz
  await page.goto(base + "/inscrever", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  await page.fill('input[name="full_name"]', "Atleta Cartao Demo");
  await page.fill('input[name="cpf"]', "529.982.247-25");
  await page.fill('input[name="phone"]', "11999997777");
  await page.fill('input[name="email"]', "cartao@corrida.com");
  const cardBtn = page.getByRole("button", { name: /Cartão|Cartao/i }).first();
  if (await cardBtn.count()) await cardBtn.click();
  await page.getByRole("button", { name: /Pagar com cartão|Pagar com cartao|Finalizar|Pagar/i }).first().click();
  await page.waitForTimeout(1500);
  await shot(page, "04-pagamento-cartao.png", true);

  // 3) ADMIN login
  await page.goto(base + "/admin", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  await shot(page, "05-admin-login.png", true);

  await page.fill('input[type="password"]', "demo");
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForTimeout(1200);

  // Aba dados (default)
  await shot(page, "06-admin-dados-corrida.png", true);

  // Fotos
  await page.getByRole("button", { name: /Fotos/i }).click();
  await page.waitForTimeout(600);
  await shot(page, "07-admin-fotos.png", true);

  // Recebimento
  await page.getByRole("button", { name: /Recebimento/i }).click();
  await page.waitForTimeout(800);
  await shot(page, "08-admin-recebimento.png", true);

  // Inscritos
  await page.getByRole("button", { name: /Inscritos/i }).click();
  await page.waitForTimeout(600);
  await shot(page, "09-admin-inscritos.png", true);

  await browser.close();
  console.log("Pasta:", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
