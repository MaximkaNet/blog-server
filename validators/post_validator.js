const tagsValidator = async (value) => {
    for (let i = 0; i < value.length; i++) {
        const tag = value[i];
        if (typeof tag !== 'object')
            return Promise.reject('The "tag" will be "object"')
        else if (!tag.hasOwnProperty('id'))
            return Promise.reject(`The "tags[${i}].id" is required`)
        else if (typeof tag.id !== 'number')
            return Promise.reject(`The "tags[${i}].id" will be "number"`)
        else if (tag.hasOwnProperty('method')) {
            if (tag.method !== 'add' && tag.method !== 'remove')
                return Promise.reject('The "tag.method" will be "add" or "remove". Default is "add"')
        }
    }
}

module.exports = tagsValidator