'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MapPin, Package, GitCompareArrows, Bell, KeyRound, Save, LogOut, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { useAuthStore, selectIsAuthenticated } from '@/store/auth';

export default function AccountPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    api
      .getMe()
      .then((user: User) => {
        setUser(user);
        setProfile({ name: user.name ?? '', phone: user.phone ?? '', email: user.email });
      })
      .catch(() => {
        logout();
        router.replace('/login');
      });
  }, [isAuthenticated, router, setUser, logout]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-4 text-2xl font-bold">Inicia sesión para continuar</h1>
        <Link
          href="/login"
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);
    try {
      const user = await api.updateProfile(profile);
      setUser(user);
      setProfileMessage('Perfil actualizado correctamente');
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMessage('Contraseña actualizada correctamente');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <UserIcon className="h-8 w-8 text-primary" />
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {authUser?.name ?? 'Mi cuenta'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400">{authUser?.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
            router.refresh();
          }}
          className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-600 transition-colors hover:border-red-400 hover:text-red-500 dark:border-stone-700 dark:text-stone-300"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleProfileSubmit}
          className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Save className="h-5 w-5 text-primary" />
            Mis datos
          </h2>

          {profileMessage && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {profileMessage}
            </div>
          )}
          {profileError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {profileError}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Teléfono
            </label>
            <input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
              placeholder="+51 999 999 999"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {savingProfile ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <KeyRound className="h-5 w-5 text-primary" />
            Cambiar contraseña
          </h2>

          {passwordMessage && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {passwordMessage}
            </div>
          )}
          {passwordError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {passwordError}
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium">
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-primary dark:border-stone-700 dark:bg-stone-800"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="w-full rounded-full border border-primary py-3 font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
          >
            {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/wishlist"
          className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <Heart className="h-5 w-5 text-primary" />
          <span className="font-semibold">Mis favoritos</span>
        </Link>
        <Link
          href="/orders"
          className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <Package className="h-5 w-5 text-primary" />
          <span className="font-semibold">Mis pedidos</span>
        </Link>
        <Link
          href="/compare"
          className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <GitCompareArrows className="h-5 w-5 text-primary" />
          <span className="font-semibold">Comparar productos</span>
        </Link>
        <Link
          href="/alerts"
          className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <Bell className="h-5 w-5 text-primary" />
          <span className="font-semibold">Alertas de precio</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-semibold">Más información</span>
        </Link>
      </div>
    </div>
  );
}