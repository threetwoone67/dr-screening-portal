// auth.js - shared login/session/logout
(function(){
  function sb(){ return window.getSupabaseClient(); }

  async function getSession(){
    const { data, error } = await sb().auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function getProfile(user){
    if (!user || !user.email) return null;
    const email = String(user.email).trim().toLowerCase();
    const { data, error } = await sb().from('profiles').select('*').eq('email', email).maybeSingle();
    if (error) { console.warn('profile load failed:', error.message); return null; }
    return data || null;
  }

  function saveLocalUser(user, profile){
    const email = String(user?.email || '').trim().toLowerCase();
    localStorage.setItem('dr_current_email', email);
    localStorage.setItem('dr_current_profile', JSON.stringify(profile || {}));
    localStorage.setItem('dr_user_role', String(profile?.role || 'user'));
    localStorage.setItem('dr_auth_ok', 'true');
  }

  async function requireAuth(){
    try{
      const session = await getSession();
      if (!session || !session.user) {
        localStorage.removeItem('dr_auth_ok');
        location.href = 'index.html';
        return null;
      }
      const profile = await getProfile(session.user);
      saveLocalUser(session.user, profile);
      return { session, user: session.user, profile };
    }catch(err){
      console.error('requireAuth failed:', err);
      location.href = 'index.html';
      return null;
    }
  }

  async function login(email, password){
    const { data, error } = await sb().auth.signInWithPassword({
      email: String(email || '').trim().toLowerCase(),
      password: String(password || '')
    });
    if (error) throw error;
    const profile = await getProfile(data.user);
    saveLocalUser(data.user, profile);
    return { user: data.user, profile };
  }

  async function logout(){
    try { await sb().auth.signOut(); } catch(e) { console.warn(e); }
    ['dr_current_email','dr_current_profile','dr_user_role','dr_auth_ok','admin_logged_in'].forEach(k => localStorage.removeItem(k));
    location.href = 'index.html';
  }

  window.DR_AUTH = { getSession, getProfile, requireAuth, login, logout };
  window.logout = logout;
})();
