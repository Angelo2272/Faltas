'use server'

import { createSession } from '@/app/lib/session'
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/User'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

// --- REGISTER ---
export async function register(formData: FormData) {
  await dbConnect()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) return { error: 'Faltan datos' }

  // Verificar si existe
  const existe = await User.findOne({ email })
  if (existe) return { error: 'El usuario ya existe' }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Crear usuario
  const newUser = await User.create({ name, email, password: hashedPassword, role: 'STUDENT' })

  // Crear sesión y redirigir
  await createSession(newUser._id.toString(), newUser.role)
  redirect('/dashboard')
}

// --- LOGIN ---
export async function login(formData: FormData) {
  await dbConnect()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Faltan credenciales' }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !user.password) return { error: 'Credenciales inválidas' }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) return { error: 'Credenciales inválidas' }

  await createSession(user._id.toString(), user.role)
  redirect('/dashboard')
}