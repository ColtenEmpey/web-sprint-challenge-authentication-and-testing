const db = require("../data/dbConfig")
const User= require("./users/users-model")

describe('users model', ()=>{
    beforeEach(async ()=>{
        await db('users').truncate();
    })

    describe ("add user", ( )=>{
        it('adds user to db', async ()=>{
            const numUsers = await db('users')
            expect(numUsers).toHaveLength(0)
            await User.add({username: 'john', password: 'doe'})
            await User.add({username: 'jane', password: 'doe'})
            const newNumUsers= await db('users')
            expect(newNumUsers).toHaveLength(2)
        })
        it('inserts and returns correct user', async ()=>{
            let user = await User.add({username: 'john', password: 'doe'})
            expect(user.username).toBe('john')
            expect(user.password).toBe('doe')
        })
    })

    describe ("find users", ( )=>{
        it('returns all users in the db', async ()=>{
            const numUsers = await db('users')
            expect(numUsers).toHaveLength(0)
            await User.add({username: 'john', password: 'doe'})
            await User.add({username: 'jane', password: 'doe'})
            const newNumUsers= await User.find()
            expect(newNumUsers).toHaveLength(2)
        })
        it('inserts and returns correct user', async ()=>{
            await User.add({username: 'john', password: 'doe'})
            const users = await User.find()
            expect(users[0].username).toBe('john')
            expect(users[0].id).toBe(1)
        })
    })

})