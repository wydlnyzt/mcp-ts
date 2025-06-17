import { z } from 'zod'

export interface Tool {
    name: string
    description: string
    inputSchema: {
        type: 'object'
        properties: Record<string, z.ZodTypeAny>
    }
}

export abstract class ToolBase {
    protected name: string
    protected description: string
    protected schema: z.ZodObject<any> = z.object({})

    constructor(name: string, description: string) {
        this.name = name
        this.description = description
    }

    async run(args?: z.infer<typeof this.schema>): Promise<{
        content: Array<{ type: 'text'; text: string }>
    }> {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: this.execute(args),
                },
            ],
        }
    }

    info(): Tool {
        return {
            name: this.name,
            description: this.description + this.getDependencyInfo(),
            inputSchema: {
                type: 'object',
                properties: this.schema.shape,
            },
        }
    }

    abstract execute(args?: z.infer<typeof this.schema>): string

    // #region Dependency Management
    protected dependencies: Set<string> = new Set()

    protected addDependency(tool_name: string): void {
        this.dependencies.add(tool_name)
    }

    protected addDependencies(tool_names: string[]): void {
        tool_names.forEach((tool_name) => this.addDependency(tool_name))
    }

    private getDependencyInfo(): string {
        if (this.dependencies.size === 0) return ''
        return `\n\n\nThis tool depends on the following tools in order: 
        
  > ${Array.from(this.dependencies).join('\n\n  > ')}.`
    }
    // #endregion
}
