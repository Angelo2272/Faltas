import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/User'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  return { isAuth: true, userId: session.userId, role: session.role }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  await dbConnect()
  const user = await User.findById(session.userId)
  
  if (!user) return null
  
  // Convertimos a objeto plano para evitar problemas de serialización de Mongoose en Next.js
  const userObject = user.toObject()
  // Eliminamos password por seguridad
  delete userObject.password 
  // Convertimos _id a string si es necesario
  const userResponse = { ...userObject, _id: userObject._id.toString() }

  return userResponse
})