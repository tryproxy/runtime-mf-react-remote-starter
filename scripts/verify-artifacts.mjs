import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const distRoot = path.join(repositoryRoot, 'dist');

function fail(message) {
  throw new Error(`Artifact verification failed: ${message}`);
}

function readJson(relativePath) {
  const artifactPath = path.join(distRoot, relativePath);

  if (!fs.existsSync(artifactPath)) {
    fail(`missing ${relativePath}`);
  }

  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

function requireArtifact(relativePath) {
  const artifactPath = path.join(distRoot, relativePath);

  if (!fs.existsSync(artifactPath) || fs.statSync(artifactPath).size === 0) {
    fail(`missing or empty ${relativePath}`);
  }

  return artifactPath;
}

const manifest = readJson('mf-manifest.json');
const nav = readJson('nav.json');

if (
  manifest.id !== 'runtime_mf_react_remote_starter' ||
  manifest.name !== 'runtime_mf_react_remote_starter'
) {
  fail('mf-manifest.json has the wrong remote identity');
}

if (!Array.isArray(manifest.shared) || manifest.shared.length !== 0) {
  fail('the starter must not publish shared dependencies');
}

const mountExpose = manifest.exposes?.find(
  (expose) => expose.path === './mount'
);

if (!mountExpose) {
  fail('mf-manifest.json does not expose ./mount');
}

const remoteEntry = manifest.metaData?.remoteEntry;
const remoteEntryPath = path.join(
  remoteEntry?.path ?? '',
  remoteEntry?.name ?? ''
);

if (!remoteEntryPath) {
  fail('mf-manifest.json does not name remoteEntry.js');
}

requireArtifact(remoteEntryPath);

const exposeAssets = [
  ...(mountExpose.assets?.js?.sync ?? []),
  ...(mountExpose.assets?.js?.async ?? []),
  ...(mountExpose.assets?.css?.sync ?? []),
  ...(mountExpose.assets?.css?.async ?? []),
];

if (exposeAssets.length === 0) {
  fail('./mount does not declare any assets');
}

for (const asset of exposeAssets) {
  requireArtifact(asset);
}

const mountCssAssets = [
  ...(mountExpose.assets?.css?.sync ?? []),
  ...(mountExpose.assets?.css?.async ?? []),
];

if (mountCssAssets.length === 0) {
  fail('./mount does not declare embedded CSS');
}

const mountCss = mountCssAssets
  .map((asset) => fs.readFileSync(path.join(distRoot, asset), 'utf8'))
  .join('\n');

const forbiddenEmbeddedSelectors = [
  ['document :root', /(^|[,{])\s*:root(?=[\s,.#:[>{+~])/m],
  ['document :host', /(^|[,{])\s*:host(?=[\s,.#:[>{+~])/m],
  ['html', /(^|[,{])\s*html(?=[\s,.#:[>{+~])/m],
  ['body', /(^|[,{])\s*body(?=[\s,.#:[>{+~])/m],
  ['standalone #root', /(^|[,{])\s*#root(?=[\s,.#:[>{+~])/m],
  ['unscoped link reset', /(^|[,{])\s*a\s*{/m],
  ['unscoped universal reset', /(^|[{])\s*\*(?:\s*,|\s*{)/m],
  ['unscoped dark variables', /(^|[,{])\s*\.dark\s*{/m],
  ['host-owned custom property definition', /--rmf-[\w-]+\s*:/m],
];

for (const [label, pattern] of forbiddenEmbeddedSelectors) {
  if (pattern.test(mountCss)) {
    fail(`./mount CSS contains ${label}`);
  }
}

if (!mountCss.includes('[data-rmf-root]')) {
  fail('./mount CSS does not contain the remote root scope');
}

const portalSemanticReset =
  /[^{}]*\[data-rmf-portal-root\][^{}]*\{[^{}]*--(?:background|foreground|card|popover|primary|secondary|muted|accent|border|input|ring):/m;

if (portalSemanticReset.test(mountCss)) {
  fail(
    'the portal root resets semantic theme tokens instead of inheriting them'
  );
}

const indexHtml = fs.readFileSync(requireArtifact('index.html'), 'utf8');
const standaloneStylesheetMatch = indexHtml.match(
  /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["']/
);

if (!standaloneStylesheetMatch) {
  fail('index.html does not declare the standalone stylesheet');
}

const standaloneCssPath = standaloneStylesheetMatch[1].replace(/^\//, '');
const standaloneCss = fs.readFileSync(
  requireArtifact(standaloneCssPath),
  'utf8'
);

if (standaloneCss.includes('@layer rmf-remote')) {
  fail('standalone CSS is wrapped in the embedded-only rmf-remote layer');
}

const standaloneBaseLayer = standaloneCss.search(/@layer\s+base\s*{/);
const standaloneUtilitiesLayer = standaloneCss.search(/@layer\s+utilities\s*{/);

if (
  standaloneBaseLayer === -1 ||
  standaloneUtilitiesLayer === -1 ||
  standaloneBaseLayer > standaloneUtilitiesLayer
) {
  fail('standalone CSS must establish the base layer before utilities');
}

if (nav.moduleId !== 'starter') {
  fail('nav.json has the wrong moduleId');
}

const expectedPages = [
  { id: 'overview', segment: '' },
  { id: 'patterns', segment: 'patterns' },
];
const actualPages = Array.isArray(nav.pages)
  ? nav.pages.map(({ id, segment }) => ({ id, segment }))
  : null;

if (JSON.stringify(actualPages) !== JSON.stringify(expectedPages)) {
  fail('nav.json must contain only the overview and patterns pages');
}

const builtText = fs
  .readdirSync(distRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) =>
    fs.readFileSync(path.join(entry.parentPath, entry.name), 'utf8')
  )
  .join('\n');

const forbiddenDemoCopy = [
  '/v1/account/me',
  'Crash module render',
  'Protected API:',
  'Ship portal smoke test',
  'What this proves',
];

for (const text of forbiddenDemoCopy) {
  if (builtText.includes(text)) {
    fail(`built artifacts contain removed demo copy: ${text}`);
  }
}

console.log(
  `Verified ./mount with ${exposeAssets.length} assets and ${mountCssAssets.length} embedded stylesheet(s).`
);
