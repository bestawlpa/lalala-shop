import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
// const bcrypt = require('bcrypt')

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials, req){
                const {email,password} = credentials;
                try {
                    const res = await fetch('http://localhost:3000/users')
                    const users = await res.json();
                    const user = users.find(user => user.email === email)
                    console.log('test-user',user);
                    if(!user){
                        return null;
                    };

                    const passwordMatch = await bcrypt.compare(password, user.password)
                    if(!passwordMatch){
                        return null;
                    };

                    return user;
     
                } catch (error) {
                    
                }
            }
        })
    ],
    session:{
        strategy: "jwt"
    },
    pages:{
        signIn: "/login"
    },
    // callbacks: {
    //     async jwt ({ token, user }) {
    //         if (user?._id) token._id = user._id
    //         if (user?.username) token.username = user.username 
    //         if (user?.role) token.role = user.role 
    //         return token
    //     },
    //     async session ({ session, token, user }) {
    //         if (token?._id) session.user._id = token._id
    //         if (token?.username) session.user.username = token.username
    //         if (token?.role) session.user.role = token.role
    //         if (token?.sub) session.user._id = token.sub
    //         return session
    //     },
    // }
    callbacks: {
        async jwt({ token, user }) {
            if (user) {        
                if (user._id) token._id = user._id;
                if (user.username) token.username = user.username;
                if (user.role) token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token._id) session.user._id = token._id;
            if (token.username) session.user.username = token.username;
            if (token.role) session.user.role = token.role;
            if (token.sub) session.user._id = token.sub;
            return session;
        },
    }
});

export { handler as GET, handler as POST }