import net from "node:net";
import { spawn } from "node:child_process";

const requestedPort = Number(process.env.PORT || 3001);
const codespaceName = process.env.CODESPACE_NAME;
const forwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || "app.github.dev";

function canListen(port) {
	return new Promise((resolve) => {
		const server = net.createServer();
		server.once("error", () => resolve(false));
		server.once("listening", () => server.close(() => resolve(true)));
		server.listen(port, "0.0.0.0");
	});
}

async function hasRunningServer(port) {
	try {
		const response = await fetch(`http://127.0.0.1:${port}/`);
		return response.status < 500;
	} catch {
		return false;
	}
}

function printUrls(port) {
	console.log(`Local:  http://localhost:${port}`);
	if (codespaceName) {
		console.log(`Public: https://${codespaceName}-${port}.${forwardingDomain}`);
	}
}

let port = requestedPort;

if (!(await canListen(port)) && (await hasRunningServer(port))) {
	console.log(`A development server is already running on port ${port}.`);
	printUrls(port);
	process.exit(0);
}

while (!(await canListen(port))) port += 1;

if (port !== requestedPort) {
	console.warn(`Port ${requestedPort} is busy; using port ${port}.`);
}

printUrls(port);

const next = spawn("next", ["dev", "--hostname", "0.0.0.0", "--port", String(port)], {
	stdio: "inherit",
	shell: process.platform === "win32",
	env: { ...process.env, PORT: String(port) },
});

next.on("exit", (code, signal) => {
	process.exitCode = signal ? 1 : code ?? 1;
});
