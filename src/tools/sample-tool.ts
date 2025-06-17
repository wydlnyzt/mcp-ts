import z from 'zod'
import { ToolBase } from '../tool-base'

const TOOL_NAME = `wydln-get-user`
const TOOL_DESC = `Search user information`

const users = [
    {
        name: 'aaaa',
        email: 'aaaa@gmail.com',
    },
    {
        name: 'bbbb',
        email: 'bbbb@gmail.com',
    },
]

export class SearchUserTool extends ToolBase {
    constructor() {
        super(TOOL_NAME, TOOL_DESC)
        this.schema = z.object({
            name: z.string().optional().describe('User name to search'),
            email: z.string().optional().describe('User email to search'),
        })
    }

    execute(args?: z.infer<typeof this.schema>): string {
        const { name, email } = args || {}
        const result = users.filter(
            (user) =>
                (name ? user.name.includes(name) : true) &&
                (email ? user.email.includes(email) : true),
        )

        return JSON.stringify(result)
    }
}
