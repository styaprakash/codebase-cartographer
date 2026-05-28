'use client'

const CODE_SNIPPET = `function resolveDependencies(module) {
    const deps = module.getImports();
    return deps.map(d => {
        const resolved = AST.findSource(d);
        return {
            source: module.id,
            target: resolved.id,
            strength: analyzeCoupling(module, resolved)
        };
    });
}

async function generateGraph(root) {
    const nodes = await indexer.crawl(root);
    const edges = nodes.flatMap(n => resolveDependencies(n));
    return { nodes, edges };
}

class CodeParser {
    constructor(repo) {
        this.repo = repo;
        this.ast = new TreeSitter();
    }
    async parseFile(path) {
        const content = await fs.readFile(path);
        return this.ast.parse(content);
    }
}`

export default function IndexingBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden opacity-[0.08] blur-[3px] pointer-events-none">
            <style>{`
                @keyframes scrollCode {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .scrolling-code {
                    font-family: var(--font-geist-mono), monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    white-space: pre;
                    color: #6366F1;
                    animation: scrollCode 60s linear infinite;
                }
            `}</style>
            <div className="scrolling-code">
                {CODE_SNIPPET}
                {CODE_SNIPPET}
            </div>
        </div>
    )
}
