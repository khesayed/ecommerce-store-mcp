import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import pks from "../package.json" with { type: "json" };

const { name, version } = pks;
const { API_BASE_URL } = process.env;

const server = new McpServer({
  name: name,
  version: version,
  capabilities: {
    resources: {}, // Enable resources
    prompts: {}, // enable prompts
    tools: {}, // enable tools
  },
});


server.tool(
  "list-products",
  "List all products",
  async () => {
    try {
      const req = await fetch(`${API_BASE_URL}/products`);
      const res = await req.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res),
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve products list`,
          },
        ],
      };
    }
  }
);

// Async tool to get product details from external API call
server.tool(
  "get-product-info",
  "Get product information by product ID",
  { id: z.string() },
  async ({ id }) => {
    try {
      const req = await fetch(`${API_BASE_URL}/products/${id}`);
      const res = await req.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res),
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve product ${id} information`,
          },
        ],
      };
    }
  }
);

// Async tool to add a product
server.tool(
  "add-product",
  "Add a new product",
  { title: z.string({ required_error: 'please provide product title' }), description: z.string(), price: z.number().positive(), category: z.enum(["computer", "mobile"]), image: z.string() },
  async ({ title, description, price, category, image }) => {
    try {
      const req = await fetch(`${API_BASE_URL}/products`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, price, category, image })
        }
      );

      const res = await req.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res),
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to add product ${title} ${e}`,
          },
        ],
      };
    }
  }
);

// Resources
server.resource(
  "Shopping Policy",
  "file:///data/shopping-policy.md",
  async (uri) => {
    try {
      const { fileURLToPath } = await import("url");
      const path = await import("path");
      const { readFile } = await import("fs/promises");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const filePath = path.join(__dirname, "data/shopping-policy.md");

      const data = await readFile(filePath, "utf8");

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: data,
          },
        ],
      }
    } catch {
      return {
        contents: [
          {
            uri: uri.href,
            text: "Unable to load resource",
          },
        ],
      }
    }
  }
);

// Dynamic resource with parameters
server.resource(
  "faq",
  new ResourceTemplate("faqs://{q}", { list: undefined }),
  async (uri, { q }) => {
    let content = 'register';

    if (q === 'login') {
      content = 'How I can sign in'
    }

    if (q === 'checkout') {
      content = 'How I can checkout cart'
    }

    if (q === 'cart') {
      content = 'How I can add product to cart'
    }

    return {
      contents: [{
        uri: uri.href,
        text: content
      }]
    }
  });

// Prompts
server.prompt(
  "customer-welcome",
  "Welcome a new customer",
  { name: z.string(), style: z.string() },
  ({ name, style }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please welcome our new customer ${name} in ${style} style.`,
      }
    }]
  })
);

// Run server
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.warn("🔥 MCP Server running on stdio");
} catch (e) {
  console.error("🧨 Fatal error in server:", e);
  process.exit(1);
}
