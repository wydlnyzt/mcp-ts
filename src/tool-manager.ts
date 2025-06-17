import { Tool, ToolBase } from './tool-base'
import { SearchUserTool } from './tools/sample-tool'

export class ToolManager {
    private static tools: Map<string, ToolBase> = new Map()
    private static toolsInfo: Map<string, Tool> = new Map()

    static initialize(): void {
        ;[new SearchUserTool()].forEach((tool) => this.registerTool(tool))
    }

    private static registerTool(tool: ToolBase): void {
        const definition = tool.info()
        this.tools.set(definition.name, tool)
        this.toolsInfo.set(definition.name, definition)
    }

    static getAllToolsDescription(): Tool[] {
        return Array.from(this.toolsInfo.values())
    }

    static getAllToolsDefinition(): Record<string, any> {
        return this.toolsInfo
    }

    static async run(name: string, args: any): Promise<any> {
        const tool = this.tools.get(name)
        if (!tool) {
            throw new Error(`Tool ${name} not found`)
        }
        return await tool.run(args)
    }
}
