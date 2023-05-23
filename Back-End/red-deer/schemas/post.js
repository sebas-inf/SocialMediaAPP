export default{
    name: 'post',
    type: 'document',
    title: 'Post',
    fields: [
        {
            name: 'title',
            title: 'title',
            type: 'string'
        },
        {
            name: 'caption',
            title: 'Caption',
            type: 'string'
        },
        {
            name: 'location',
            title: 'Location',
            type: 'url'
        },
        {
            name: 'flair',
            title: 'Flair',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options:{
                hotspot: true
            }
        },
        {
            name: 'userId',
            title: 'UserID',
            type: 'string'
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'like',
            title: 'Like',
            type: 'array',
            of: [{type: 'like'}]
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{type: 'comment'}]
        }
    ]

}