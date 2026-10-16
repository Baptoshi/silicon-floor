# Silicon Floor is a hosted MCP server: https://siliconfloor.com/mcp (Streamable HTTP, no key).
# This image runs the stdio bridge published on npm as siliconfloor-mcp: it forwards each JSON-RPC message
# to the hosted endpoint and writes the reply back. It holds no data and runs no server logic of its own.
# A client that speaks Streamable HTTP should use the URL directly and skip this image.
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY bin ./bin
USER node
ENTRYPOINT ["node", "bin/siliconfloor-mcp.mjs"]
