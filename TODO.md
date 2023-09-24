# 18.09.23
### Goal
* Change routes (`paths`)
* Tests. Make a fetches in anyone file (`tests.js`)
* dtos
* I will think about folder structure  

# 20.08.23
### Goal
* The route with the path '/delete/:postId' should delete the post permanently
### Changes
* '/status/:postId' => '/:postId/status 
* '/topic/:postId' => '/:postId/topic
* '/title/:postId' => '/:postId/title
* '/content/:postId' => '/:postId/content
* '/tag/:postId' => '/:postId/tag'
* '/tag/:postId' => '/:postId/tag'

# 21.08.23
### Changes
- Add documentation to all methods in services and controllers
- Edit routes
- Fix tests
- Add new features in services
- Fix data types in controllers
- Add validators on routes

# 22.08.23
### Goal
- Add actions with user avatar
- Search tag, topic, post, user
- Actions with comments
- Upload files/images
- Download files/images
- Create file path
- Set up auth_middlewares
- Roles / themes

# 23.08.23
## Description
Regrouping routes and controllers. Change post services.
### Removed
- ~~`post/:postId/title`~~
- ~~`post/:postId/content`~~
- ~~`post/:postId/status`~~
- ~~`post/:postId/topic/:topicId`~~
- ~~`post/:postId/tag/:tagId`~~
- ~~`post/:postId/last/byTag/:tagId`~~
- ~~`post/:postId/last/byTopic/:topicId`~~
### Added
- PUT `post/:postId` - Edit fields like this:
```
{
    title: "new title", 
    content: "new content",
    status: "draft",
    topicId: 1,
    tags: [{
        method: "add", // "add", "remove". Default "add"
        id: 2
    }]
}
```
Means edit on 1 query to the server
- GET `post/last/posts`
