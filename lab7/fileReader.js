const fs = require('fs')
const path = require('path')
const {fileTypes, fileIcons} = require('./supportFiles')

//export 1 func, func này nhập location làm path cần nạp
exports.load = (userRoot, location) => {
    return new Promise((resolve, reject) => {

        let files = fs.readdirSync(location)
        let result = []

        files.forEach(f => {

            if(f.startsWith('.')){
                return;
            }

            let name = f
            let path1 = location + '/' + name
            if(location.endsWith('/')){
                path1 = location + name
            }
            path1 = path.join(path1)
            let ext = path.extname(name)
            let stats = fs.statSync(path1)
            let type = fileTypes[ext] || 'Other File'
            let icon = fileIcons[ext] || '<i class="fas fa-file"></i>'
            userRoot = path.join(userRoot)
            let subPath = path1.replace(userRoot, '')
            subPath = path.join(subPath)
            if(stats.isDirectory()){
                if(subPath.startsWith("\\")){
                    subPath = `?dir=${subPath.substring(1)}`
                }
                else{
                    subPath = `?dir=${subPath}`
                }
            }

            result.push({
                name: name,
                path: path1,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                lastModified: stats.mtime,
                ext: ext,
                type: type,
                icon: icon,
                subPath: subPath
            })
        })
        resolve(result)
    })
}