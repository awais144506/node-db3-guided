const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

function findPosts(user_id) {
  const result = db('posts as p')
    .select('p.id as post_id', 'username', 'contents')
    .join('users as u', 'p.user_id', 'u.id')
    .where('u.id', user_id)
  return result
  /*
  select 
p.id as post_id,u.username,contents
from posts as  p
join users as u
on p.user_id = u.id
where u.id = 3
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

function find() {
  const result = db('users as u')
    .select('u.id as user_id', 'username')
    .count('p.id as post_count')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .groupBy('u.id')
  return result
  /*
  select 
u.id as user_id,username,count(p.id) as post_count
from users as u
left join posts as p
on u.id = p.user_id
group by u.id

    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows =await db('users as u')
    .select('u.id as user_id',
      'username',
      'contents',
      'p.id as post_id'
    )
    .leftJoin('posts as p',
      'u.id',
      'p.user_id')
    .where(
      'u.id',
      id)

  let result = rows.reduce((acc, row) => {
    if (row.contents) {
      acc.posts.push({ contents: row.contents, post_id: row.post_id })
    }
    return acc
  }, {  user_id: rows[0].user_id, username: rows[0].username,posts: [] })

  return result
  /*
  select 
u.id as user_id,username,p.id as post_id,contents
from users as u
left Join posts as p
on u.id = p.user_id
where u.id = 2
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
