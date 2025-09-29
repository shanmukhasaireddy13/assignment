// OpenAPI 3.0 spec kept separate from route files for cleanliness

const apiSpec = {
  openapi: '3.0.0',
  info: { title: 'MERN Auth + RBAC + Tasks API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:4000' }],
  tags: [
    { name: 'Auth', description: 'Authentication APIs' },
    { name: 'User', description: 'User self APIs' },
    { name: 'Tasks', description: 'Task CRUD APIs' },
    { name: 'Admin', description: 'Admin-only management APIs' }
  ],
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register', requestBody: {
          required: true, content: { 'application/json': { schema: {
            type: 'object', required: ['name','email','password'],
            properties: { name:{type:'string'}, email:{type:'string'}, password:{type:'string'} }
          } } }
        }, responses: { 200: { description: 'Registered' } }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login', requestBody: {
          required: true, content: { 'application/json': { schema: {
            type: 'object', required: ['email','password'],
            properties: { email:{type:'string'}, password:{type:'string'} }
          } } }
        }, responses: { 200: { description: 'Logged in' } }
      }
    },
    '/api/v1/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout', responses: { 200: { description: 'Logged out' } } }
    },
    '/api/v1/auth/is-auth': {
      get: { tags: ['Auth'], summary: 'Check auth', responses: { 200: { description: 'OK' } } }
    },

    '/api/v1/user/data': {
      get: { tags: ['User'], summary: 'Get current user data', responses: { 200: { description: 'OK' } } }
    },

    '/api/v1/tasks': {
      get: { tags: ['Tasks'], summary: 'List tasks', responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Tasks'], summary: 'Create task', requestBody: {
          required: true, content: { 'application/json': { schema: {
            type: 'object', required: ['title'], properties: { title:{type:'string'}, description:{type:'string'} }
          } } }
        }, responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/tasks/{id}': {
      parameters: [{ in:'path', name:'id', required:true, schema:{type:'string'} }],
      get: { tags: ['Tasks'], summary: 'Get task', responses: { 200: { description: 'OK' } } },
      put: { tags: ['Tasks'], summary: 'Update task', responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Tasks'], summary: 'Delete task', responses: { 200: { description: 'Deleted' } } }
    },

    '/api/v1/admin/users': {
      get: { tags: ['Admin'], summary: 'List users with counts', responses: { 200: { description: 'OK' } } }
    },
    '/api/v1/admin/audits': {
      get: { tags: ['Admin'], summary: 'List recent audit logs', responses: { 200: { description: 'OK' } } }
    },
    '/api/v1/admin/users/{id}': {
      parameters: [{ in:'path', name:'id', required:true, schema:{type:'string'} }],
      get: { tags: ['Admin'], summary: 'Get user detail', responses: { 200: { description: 'OK' } } },
      put: { tags: ['Admin'], summary: 'Update user profile', responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin'], summary: 'Delete user', responses: { 200: { description: 'Deleted' } } }
    },
    '/api/v1/admin/users/{id}/password': {
      parameters: [{ in:'path', name:'id', required:true, schema:{type:'string'} }],
      put: { tags: ['Admin'], summary: 'Change user password', responses: { 200: { description: 'OK' } } }
    },
    '/api/v1/admin/users/{id}/tasks': {
      parameters: [{ in:'path', name:'id', required:true, schema:{type:'string'} }],
      post: { tags: ['Admin'], summary: 'Create task for user', responses: { 201: { description: 'Created' } } }
    },
    '/api/v1/admin/tasks/{taskId}': {
      parameters: [{ in:'path', name:'taskId', required:true, schema:{type:'string'} }],
      put: { tags: ['Admin'], summary: 'Update task (admin)', responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin'], summary: 'Delete task (admin)', responses: { 200: { description: 'Deleted' } } }
    },
    '/api/v1/admin/create-admin': {
      post: { tags: ['Admin'], summary: 'Create a new admin', responses: { 201: { description: 'Created' } } }
    }
  }
};

export default apiSpec;


