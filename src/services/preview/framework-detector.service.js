import fs from 'fs'
import path from 'path'

export const detectFramework = (
    workspacePath
) => {

    const packageJsonPath =
        path.join(workspacePath, 'package.json')

    if(!fs.existsSync(packageJsonPath)){
        return null
    }

    const packageJson =
        JSON.parse(
            fs.readFileSync(packageJsonPath,'utf-8')
        )

    const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    }

    if(deps.react && deps.vite){

        return {
            framework:'vite-react',
            command:'npm run dev',
            defaultPort:5173
        }
    }

    if(deps.next){

        return {
            framework:'reactjs',
            command:'npm run dev',
            defaultPort:3000
        }
    }

    return null
}