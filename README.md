# ecommerce-store-mcp

**ecommerce-store-mcp** is a Model Context Protocol (MCP) server built with Node.js that offers intelligent ecommerce tools for agents and applications. It enables contextual access to product catalogs, and store policies.

## Features

- 🔍 List and retrieve product information  
- ➕ Add products
- 📄 Display ecommerce shopping policies  
- 🤖 Context-aware support for AI agents as a FAQ resource

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Cluade desktop, or VSCode (tools only)

### Installation

```bash
git clone https://github.com/your-username/ecommerce-store-mcp.git
cd ecommerce-store-mcp
npm install
npm run build
```

### Activating MCP

#### Cluade

```
{
  "mcpServers": {
    "ecommerce-store-mcp": {
      "command": "${PATH_TO_NODE}",
      "args": [
        "${PATH_TO_MCP_SERVER_DIR}/ecommerce-store-mcp/build/index.js"
      ],
      "env": { "API_BASE_URL": "https://fakestoreapi.com" }
    }
  }
}
```

### Inspector

```
npx @modelcontextprotocol/inspector ${PATH_TO_NODE} build/index.js
```

Then in the browser: `http://127.0.0.1:6274/`