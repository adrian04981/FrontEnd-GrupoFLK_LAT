// src/auth.js
import { supabase } from './supabase';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Error de autenticación:', error);
    throw error;
  }

  const session = data.session;
  const user = data.user;
  const jwt = session.access_token;

  // Guardar el JWT y el usuario en localStorage
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log("JWT recibido:", jwt); // Verificar que el JWT se reciba correctamente

  const { data: rolData, error: rolError } = await supabase
    .from('asignaciondeusuario')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (rolError) {
    console.error("Error al obtener el rol:", rolError);
    throw new Error('No se pudo obtener el rol del usuario');
  }

  const rolId = rolData.rol;
  return { user, rolId, jwt };
}

// Cerrar sesión
export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('user');
  localStorage.removeItem('jwt');
  window.location.href = '/login';
}

// Obtener sesión actual
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Obtener rol de usuario
export async function buscarRol(userId) {
  const { data, error } = await supabase
    .from('asignaciondeusuario')
    .select('rol')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Error al obtener el rol del usuario:", error);
    throw new Error('No se pudo obtener el rol del usuario');
  }
  
  return { rolId: data.rol };
}

export function getJWT() {
  return localStorage.getItem('jwt');
}

export function GetUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : null; // Devolver solo el ID del usuario
}