// Write your tests here
const server = require("./server")
const request = require('supertest')

//register
describe('register', ()=>{
  it('has process.env.DB_ENV as "testing"', ()=>{
    expect(process.env.NODE_ENV).toBe("testing")
  })

  it('returns 400 if no username or password', ()=>{
     return request(server).post('/api/auth/register').expect(400)
  })

  // it('register output correct',()=>{
  //   return request(server).post('/api/auth/register')
  //     .expect('Content-Type', /json/)
  //     // .set('Accept', /json/)
  //     .send({username: 'john', password: 'doe'})
  //     .expect(200)
      // .then(res=>{
      //   console.log(res)
      // })
      // .expect((response)=>{
      //   assert.ok(response.username.tobe('john'))
      // })

  // })
})

//login
// describe('login', ()=>{
//   it('has process.env.DB_ENV as "testing"', ()=>{
//     expect(process.env.NODE_ENV).toBe("testing")
//   })
//   it('returns 401 if no username or password', ()=>{
//     return request(server).post('/api/auth/register').expect(400)
//   })
//   it('register output correct', ()=>{
//     request(server).post('/api/auth/register')
//   })
// })